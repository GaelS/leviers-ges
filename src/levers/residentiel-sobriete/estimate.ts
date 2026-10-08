import type { Result } from 'neverthrow'
import type { EstimationContext } from '../../application/estimate/estimation-context.ts'
import {
  toEstimateResult,
  type EstimateResult,
} from '../../application/estimate/estimate-result.ts'
import type { DataSourceError } from '../../domain/data-source.ts'
import type { UnknownTerritory } from '../../domain/territory-index.ts'
import { calculateResidentielSobrieteReduction } from './calculate-residentiel-sobriete-reduction.ts'
import { readResidentialConsumption } from './data/read-residential-consumption.ts'
import { readResidentialHeatNetworks } from './data/read-residential-heat-networks.ts'
import { weightHeatEmissionFactor } from './data/weight-heat-emission-factor.ts'
import type { ResidentielSobrieteRequest } from './residentiel-sobriete-request.ts'

function estimate(
  { territory, parameters }: ResidentielSobrieteRequest,
  { dataSource, getCommunesOf }: EstimationContext,
): Result<EstimateResult, DataSourceError | UnknownTerritory> {
  return getCommunesOf(territory)
    .andThen((communes) => readResidentialHeatNetworks({ dataSource, communes }))
    .andThen((networks) =>
      readResidentialConsumption({ dataSource, territory, networks }).map((consumption) =>
        toEstimateResult(
          calculateResidentielSobrieteReduction({
            sobrietyFractions: {
              households: parameters.householdsApplyingSobrietyFraction,
              consumptionReduction: parameters.consumptionReductionFraction,
            },
            consumption,
            heatEmissionFactor: weightHeatEmissionFactor(networks),
          }),
        ),
      ),
    )
}

export { estimate }
