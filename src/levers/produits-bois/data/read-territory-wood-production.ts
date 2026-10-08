import { Result } from 'neverthrow'
import { match } from 'ts-pattern'
import { requireQuantityColumn } from '../../../application/require-column.ts'
import type {
  DataRow,
  DataSource,
  DataSourceError,
  InvalidDataset,
} from '../../../domain/data-source.ts'
import type { ComputedLevels } from '../../../domain/lever-registry.ts'
import type { Territory } from '../../../domain/territory.ts'
import type { WoodProduction } from './wood-production.ts'

const regionsDataset = 'produits-bois/regions'

const departementsDataset = 'produits-bois/departements'

function toWoodProduction({
  dataset,
  row,
}: {
  dataset: string
  row: DataRow
}): Result<WoodProduction, InvalidDataset> {
  return Result.combine([
    requireQuantityColumn<'ThousandCubicMetres'>({ dataset, row, column: 'logs_thousand_m3' }),
    requireQuantityColumn<'ThousandCubicMetres'>({
      dataset,
      row,
      column: 'industrial_wood_thousand_m3',
    }),
  ]).map(([logs, industrialWood]) => ({ logs, industrialWood }))
}

function readTerritoryWoodProduction({
  dataSource,
  territory,
}: {
  dataSource: DataSource
  territory: Territory<ComputedLevels<'produits_bois'>>
}): Result<WoodProduction, DataSourceError> {
  const dataset = match(territory.level)
    .with('region', () => regionsDataset)
    .with('departement', () => departementsDataset)
    .exhaustive()
  return dataSource.row(dataset, territory).andThen((row) => toWoodProduction({ dataset, row }))
}

export { readTerritoryWoodProduction }
