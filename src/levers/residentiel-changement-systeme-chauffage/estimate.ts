import type { Result } from 'neverthrow'
import type { EstimationContext } from '../../application/estimate/estimation-context.ts'
import {
  toEstimateResult,
  type EstimateResult,
} from '../../application/estimate/estimate-result.ts'
import { getResidentialInputs } from '../../application/residential-consumption/get-residential-inputs.ts'
import type { DataSourceError } from '../../domain/data-source.ts'
import type { UnknownTerritory } from '../../domain/territory-index.ts'
import { calculateResidentielChangementSystemeChauffageReduction } from './calculate-residentiel-changement-systeme-chauffage-reduction.ts'
import type { ResidentielChangementSystemeChauffageRequest } from './residentiel-changement-systeme-chauffage-request.ts'
import { NATIONAL_HEATING_SHARES_ASSUMPTION } from './national-heating-shares-assumption.ts'

function estimate(
  { territory, parameters }: ResidentielChangementSystemeChauffageRequest,
  { dataSource, getCommunesOf }: EstimationContext,
): Result<EstimateResult, DataSourceError | UnknownTerritory> {
  return getCommunesOf(territory)
    .andThen((communes) => getResidentialInputs({ dataSource, territory, communes }))
    .map(({ consumption, heatEmissionFactor }) =>
      toEstimateResult(
        calculateResidentielChangementSystemeChauffageReduction({
          targetShares: {
            electricity: parameters.targetElectricityShareFraction,
            naturalGas: parameters.targetNaturalGasShareFraction,
            fuelOil: parameters.targetFuelOilShareFraction,
            wood: parameters.targetWoodShareFraction,
            heat: parameters.targetHeatNetworkShareFraction,
          },
          consumption,
          heatEmissionFactor,
        }),
        { nationalHeatingShares: NATIONAL_HEATING_SHARES_ASSUMPTION },
      ),
    )
}

export { estimate }
