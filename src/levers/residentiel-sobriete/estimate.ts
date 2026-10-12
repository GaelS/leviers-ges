import type { Result } from 'neverthrow'
import type { EstimationContext } from '../../application/estimate/estimation-context.ts'
import {
  toEstimateResult,
  type EstimateResult,
} from '../../application/estimate/estimate-result.ts'
import { readHeatNetworks } from '../../application/heat-networks/read-heat-networks.ts'
import { weightHeatEmissionFactor } from '../../application/heat-networks/weight-heat-emission-factor.ts'
import type { DataSourceError } from '../../domain/data-source.ts'
import type { UnknownTerritory } from '../../domain/territory-index.ts'
import { calculateResidentielSobrieteReduction } from './calculate-residentiel-sobriete-reduction.ts'
import { readResidentialConsumption } from './data/read-residential-consumption.ts'
import type { ResidentielSobrieteRequest } from './residentiel-sobriete-request.ts'

const residentialHeatNetworksDataset = 'residentiel-sobriete/heat-networks'

function estimate(
  { territory, parameters }: ResidentielSobrieteRequest,
  { dataSource, getCommunesOf }: EstimationContext,
): Result<EstimateResult, DataSourceError | UnknownTerritory> {
  return getCommunesOf(territory)
    .andThen((communes) => readHeatNetworks({ dataSource, dataset: residentialHeatNetworksDataset, communes }))
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
