import { Result } from 'neverthrow'
import type { DataRow, DataSource, InvalidDataset } from '../../domain/data-source.js'
import {
  calculateReseauxChaleurReduction,
  type HeatNetwork,
} from '../../domain/reseaux-chaleur/calculate-reseaux-chaleur-reduction.js'
import type { TerritoryIndex } from '../../domain/territory-index.js'
import type { TonnesCo2ePerYear } from '../../domain/units.js'
import { requireColumn, requireQuantityColumn } from '../require-column.js'
import type { EstimationError } from './estimation-error.js'
import type { Request } from './request.js'

const networksDataset = 'reseaux-chaleur/networks'

function toHeatNetwork(row: DataRow): Result<HeatNetwork, InvalidDataset> {
  const dataset = networksDataset
  return Result.combine([
    requireQuantityColumn<'MegawattHours'>({ dataset, row, column: 'delivered_mwh' }),
    requireQuantityColumn<'KgCo2ePerKwh'>({ dataset, row, column: 'emission_factor_kg_per_kwh' }),
  ]).map(([deliveredMwh, emissionFactor]) => ({ deliveredMwh, emissionFactor }))
}

function heatNetworksIn(
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

function estimateReseauxChaleur({
  request,
  dataSource,
  territoryIndex,
}: {
  request: Extract<Request, { id: 'reseaux_chaleur' }>
  dataSource: DataSource
  territoryIndex: Result<TerritoryIndex, EstimationError>
}): Result<TonnesCo2ePerYear, EstimationError> {
  return territoryIndex
    .andThen((index) => index.communesOf(request.territory))
    .andThen((communes) =>
      dataSource.rows(networksDataset).andThen((rows) => heatNetworksIn(new Set(communes), rows)),
    )
    .map((networks) =>
      calculateReseauxChaleurReduction({
        reductionFraction: request.parameters.emissionFactorReductionFraction,
        networks,
      }),
    )
}

export { estimateReseauxChaleur }
