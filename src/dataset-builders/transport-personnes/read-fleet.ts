import type BigNumber from 'bignumber.js'
import { Result, err, ok } from 'neverthrow'
import { requireColumn } from '../../application/require-column.ts'
import { invalidDataset, type DataRow, type InvalidDataset } from '../../domain/data-source.ts'
import { parseCsvText } from '../../infrastructure/csv/parse-csv-text.ts'
import { toInvalidDataset } from '../../infrastructure/csv/violation.ts'
import { requireDecimalColumn } from './require-decimal-column.ts'

type FleetGroup = 'VP' | 'TC_routier'

type FleetRow = {
  readonly level: string
  readonly code: string
  readonly group: FleetGroup
  readonly fuel: string
  readonly vehicles: BigNumber
}

const fleetDataset = 'transport-personnes/sources/sdes-parc-vp-tc-routier-2025-par-maille.csv'

const fleetGroups: readonly FleetGroup[] = ['VP', 'TC_routier']

function requireFleetGroup(row: DataRow): Result<FleetGroup, InvalidDataset> {
  return requireColumn({ dataset: fleetDataset, row, column: 'groupe' }).andThen((text) => {
    const group = fleetGroups.find((candidate) => candidate === text)
    return group === undefined
      ? err(invalidDataset({ dataset: fleetDataset, reason: 'columns_mismatch', detail: `groupe=${text}` }))
      : ok(group)
  })
}

function toFleetRow(row: DataRow): Result<FleetRow, InvalidDataset> {
  const dataset = fleetDataset
  return Result.combine([
    requireColumn({ dataset, row, column: 'maille' }),
    requireColumn({ dataset, row, column: 'code' }),
    requireFleetGroup(row),
    requireColumn({ dataset, row, column: 'carburant' }),
    requireDecimalColumn({ dataset, row, column: 'parc_2025' }),
  ]).map(([level, code, group, fuel, vehicles]) => ({ level, code, group, fuel, vehicles }))
}

function readFleet(csv: string): Result<readonly FleetRow[], InvalidDataset> {
  return parseCsvText({ text: csv, delimiter: ',' })
    .mapErr(toInvalidDataset(fleetDataset))
    .andThen((rows) => Result.combine(rows.map(toFleetRow)))
}

export { fleetDataset, readFleet }
export type { FleetGroup, FleetRow }
