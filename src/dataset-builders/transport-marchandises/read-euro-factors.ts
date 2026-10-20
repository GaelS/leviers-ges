import type BigNumber from 'bignumber.js'
import { Result, err } from 'neverthrow'
import { requireColumn } from '../../application/require-column.ts'
import { parseBig, sum, toBig } from '../../domain/big-number.ts'
import { invalidDataset, type DataRow, type InvalidDataset } from '../../domain/data-source.ts'
import { parseCsvText } from '../../infrastructure/csv/parse-csv-text.ts'
import { toInvalidDataset } from '../../infrastructure/csv/violation.ts'

const ominenaDataset = 'transport-marchandises/sources/ominea-co2-poids-lourds-diesel-g-par-vehicule-km-2024.csv'

// Source : tableur PlanET V1, FE_transports!G42:K75 : norme Euro des poids lourds diesel pour chaque vignette Crit'Air (Crit'Air E, non classé et inconnu n'en ont pas)
const EURO_STANDARD_BY_CRIT_AIR: ReadonlyMap<string, string> = new Map([
  ["Crit'Air 1", 'Euro VI'],
  ["Crit'Air 2", 'Euro VI'],
  ["Crit'Air 3", 'Euro V'],
  ["Crit'Air 4", 'Euro IV'],
  ["Crit'Air 5", 'Euro III'],
])

// Source : tableur PlanET V1, FE_transports!A31 : longues distances, 50 % du facteur SNAP « autoroute » (070301PL) et 50 % de « route » (070302PL) ; hypothèse nommée heavyVehicleTripType
const LONG_DISTANCE_SNAP_WEIGHTS: ReadonlyMap<string, BigNumber> = new Map([
  ['070301PL', toBig('0.5')],
  ['070302PL', toBig('0.5')],
])

function findFactor({
  rows,
  snapCode,
  euroStandard,
}: {
  rows: readonly DataRow[]
  snapCode: string
  euroStandard: string
}): Result<BigNumber, InvalidDataset> {
  const dataset = ominenaDataset
  const row = rows.find((candidate) => candidate['snap'] === snapCode && candidate['rubric'] === euroStandard)
  if (row === undefined) {
    return err(
      invalidDataset({ dataset, reason: 'missing_key_column', detail: `${snapCode} ${euroStandard}` }),
    )
  }
  return requireColumn({ dataset, row, column: 'valeur_2024' }).andThen((text) =>
    parseBig(text).mapErr(() =>
      invalidDataset({
        dataset,
        reason: 'unreadable',
        detail: `valeur_2024=${text} is not a decimal number`,
      }),
    ),
  )
}

function calculateLongDistanceFactor({
  rows,
  euroStandard,
}: {
  rows: readonly DataRow[]
  euroStandard: string
}): Result<BigNumber, InvalidDataset> {
  return Result.combine(
    [...LONG_DISTANCE_SNAP_WEIGHTS].map(([snapCode, weight]) =>
      findFactor({ rows, snapCode, euroStandard }).map((factor) => factor.times(weight)),
    ),
  ).map(sum)
}

function readEuroFactors(
  ominenaCsv: string,
): Result<ReadonlyMap<string, BigNumber>, InvalidDataset> {
  return parseCsvText({ text: ominenaCsv, delimiter: ',' })
    .mapErr(toInvalidDataset(ominenaDataset))
    .andThen((rows) =>
      Result.combine(
        [...EURO_STANDARD_BY_CRIT_AIR].map(([critAir, euroStandard]) =>
          calculateLongDistanceFactor({ rows, euroStandard }).map(
            (factor): readonly [string, BigNumber] => [critAir, factor],
          ),
        ),
      ),
    )
    .map((entries) => new Map(entries))
}

export { readEuroFactors }
