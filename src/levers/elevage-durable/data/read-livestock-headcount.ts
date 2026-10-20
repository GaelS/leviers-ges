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
import type { Heads } from '../../../domain/units.ts'
import { ANIMAL_TYPES, type AnimalType } from './animal-types.ts'

type LivestockHeadcount = Readonly<Record<AnimalType, Heads>>

const regionsDataset = 'elevage-durable/regions'

const departementsDataset = 'elevage-durable/departements'

// Source : data/elevage-durable/manifest.json : colonne d'effectifs de chaque type d'animal
const HEADCOUNT_COLUMN_BY_ANIMAL: Readonly<Record<AnimalType, string>> = {
  dairyCows: 'dairy_cows',
  otherCattle: 'other_cattle',
  sows: 'sows',
  otherPigs: 'other_pigs',
  goats: 'goats',
  sheep: 'sheep',
  horses: 'horses',
  mulesAndDonkeys: 'mules_and_donkeys',
  layingHens: 'laying_hens',
  broilers: 'broilers',
  otherPoultry: 'other_poultry',
}

function toHeadcount({
  dataset,
  row,
}: {
  dataset: string
  row: DataRow
}): Result<LivestockHeadcount, InvalidDataset> {
  return Result.combine(
    ANIMAL_TYPES.map((animalType) =>
      requireQuantityColumn<'Heads'>({
        dataset,
        row,
        column: HEADCOUNT_COLUMN_BY_ANIMAL[animalType],
      }).map((heads) => [animalType, heads] as const),
    ),
  ).map((entries) => Object.fromEntries(entries) as LivestockHeadcount)
}

function readLivestockHeadcount({
  dataSource,
  territory,
}: {
  dataSource: DataSource
  territory: Territory<ComputedLevels<'elevage_durable'>>
}): Result<LivestockHeadcount, DataSourceError> {
  const dataset = match(territory.level)
    .with('region', () => regionsDataset)
    .with('departement', () => departementsDataset)
    .exhaustive()
  return dataSource.row(dataset, territory).andThen((row) => toHeadcount({ dataset, row }))
}

export { readLivestockHeadcount }
export type { LivestockHeadcount }
