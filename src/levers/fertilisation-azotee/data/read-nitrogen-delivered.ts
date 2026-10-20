import { Result } from 'neverthrow'
import { match } from 'ts-pattern'
import { requireQuantityColumn } from '../../../application/require-column.ts'
import { toBig } from '../../../domain/big-number.ts'
import type {
  DataRow,
  DataSource,
  DataSourceError,
  InvalidDataset,
} from '../../../domain/data-source.ts'
import type { ComputedLevels } from '../../../domain/lever-registry.ts'
import type { Territory } from '../../../domain/territory.ts'
import { quantity } from '../../../domain/units.ts'
import type { NitrogenDelivered } from './nitrogen-delivered.ts'

const regionsDataset = 'fertilisation-azotee/regions'

const departementsDataset = 'fertilisation-azotee/departements'

// Source : hypothèse nommée nitrogenCampaigns (docs/methodology/assumptions.md) : la masse livrée à une région est la moyenne de deux campagnes ; DonneesTerritoires!D8 : « Prendre la moyenne sur 2 ans »
const REGION_CAMPAIGN_COUNT = toBig('2')

function toRegionDelivered({
  dataset,
  row,
}: {
  dataset: string
  row: DataRow
}): Result<NitrogenDelivered, InvalidDataset> {
  return Result.combine([
    requireQuantityColumn<'Tonnes'>({ dataset, row, column: 'nitrogen_delivered_tonnes_2021_2022' }),
    requireQuantityColumn<'Tonnes'>({ dataset, row, column: 'nitrogen_delivered_tonnes_2022_2023' }),
  ]).map(([firstCampaign, secondCampaign]) => {
    const bothCampaigns = firstCampaign.plus(secondCampaign)
    return {
      tonnes: quantity<'Tonnes'>(bothCampaigns.dividedBy(REGION_CAMPAIGN_COUNT).toFixed()),
      campaigns: 'two-year-average',
    }
  })
}

function toDepartementDelivered({
  dataset,
  row,
}: {
  dataset: string
  row: DataRow
}): Result<NitrogenDelivered, InvalidDataset> {
  return requireQuantityColumn<'Tonnes'>({
    dataset,
    row,
    column: 'nitrogen_delivered_tonnes_2021_2022',
  }).map((tonnes) => ({ tonnes, campaigns: 'single-campaign' }))
}

function readNitrogenDelivered({
  dataSource,
  territory,
}: {
  dataSource: DataSource
  territory: Territory<ComputedLevels<'fertilisation_azotee'>>
}): Result<NitrogenDelivered, DataSourceError> {
  return match(territory.level)
    .with('region', () =>
      dataSource
        .row(regionsDataset, territory)
        .andThen((row) => toRegionDelivered({ dataset: regionsDataset, row })),
    )
    .with('departement', () =>
      dataSource
        .row(departementsDataset, territory)
        .andThen((row) => toDepartementDelivered({ dataset: departementsDataset, row })),
    )
    .exhaustive()
}

export { readNitrogenDelivered }
