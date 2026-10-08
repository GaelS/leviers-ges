import { Result } from 'neverthrow'
import type { EstimationContext } from '../../application/estimate/estimation-context.ts'
import type { EstimationError } from '../../application/estimate/estimation-error.ts'
import {
  toEstimateResult,
  type EstimateResult,
} from '../../application/estimate/estimate-result.ts'
import { parseTerritorialLeverRequest } from '../../application/estimate/parse-request.ts'
import { readHeatNetworks } from '../../application/heat-networks/read-heat-networks.ts'
import {
  batimentsMachinesAgricolesRequestSchema,
  type BatimentsMachinesAgricolesRequestInput,
} from './batiments-machines-agricoles-request.ts'
import { calculateBatimentsMachinesAgricolesReduction } from './calculate-batiments-machines-agricoles-reduction.ts'
import { getAgriculturalConsumption } from './get-agricultural-consumption.ts'
import { weightHeatEmissionFactor } from './weight-heat-emission-factor.ts'

function estimate(
  input: BatimentsMachinesAgricolesRequestInput,
  { dataSource, getCommunesOf, getRegionByCommune }: EstimationContext,
): Result<EstimateResult, EstimationError> {
  return parseTerritorialLeverRequest(batimentsMachinesAgricolesRequestSchema, input).andThen(
    ({ territory, parameters }) =>
      getCommunesOf(territory).andThen((communes) =>
        Result.combine([
          getAgriculturalConsumption({ dataSource, territory, communes, getRegionByCommune }),
          readHeatNetworks({ dataSource, communes }).map(weightHeatEmissionFactor),
        ]).map(([consumption, heatEmissionFactor]) =>
          toEstimateResult(
            calculateBatimentsMachinesAgricolesReduction({
              reductionFractions: {
                electricity: parameters.electricityReductionFraction,
                naturalGas: parameters.naturalGasReductionFraction,
                petroleumProducts: parameters.petroleumProductsReductionFraction,
                heat: parameters.heatReductionFraction,
              },
              consumption,
              heatEmissionFactor,
            }),
          ),
        ),
      ),
  )
}

export { estimate }
