import { Result } from 'neverthrow'
import { requireColumn, requireQuantityColumn } from '../../application/require-column.js'
import type {
  DataRow,
  DataSource,
  DataSourceError,
  InvalidDataset,
} from '../../domain/data-source.js'
import type { HeatNetwork } from './calculate-reseaux-chaleur-reduction.js'

const networksDataset = 'reseaux-chaleur/networks'

function toHeatNetwork(row: DataRow): Result<HeatNetwork, InvalidDataset> {
  const dataset = networksDataset
  return Result.combine([
    requireQuantityColumn<'MegawattHours'>({ dataset, row, column: 'delivered_mwh' }),
    requireQuantityColumn<'KgCo2ePerKwh'>({ dataset, row, column: 'emission_factor_kg_per_kwh' }),
  ]).map(([deliveredMwh, emissionFactor]) => ({ deliveredMwh, emissionFactor }))
}

function keepHeatNetworksInCommunes(
  communes: ReadonlySet<string>,
  rows: readonly DataRow[],
): Result<readonly HeatNetwork[], InvalidDataset> {
  return Result.combine(
    rows.map((row) =>
      requireColumn({ dataset: networksDataset, row, column: 'commune_code' }).map((commune) => ({
        row,
        commune,
      })),
    ),
  )
    .map((located) => located.filter(({ commune }) => communes.has(commune)).map(({ row }) => row))
    .andThen((rowsInside) => Result.combine(rowsInside.map(toHeatNetwork)))
}

function readHeatNetworks({
  dataSource,
  communes,
}: {
  dataSource: DataSource
  communes: readonly string[]
}): Result<readonly HeatNetwork[], DataSourceError> {
  return dataSource
    .rows(networksDataset)
    .andThen((rows) => keepHeatNetworksInCommunes(new Set(communes), rows))
}

export { readHeatNetworks }
