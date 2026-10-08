import type { Result } from 'neverthrow'
import type { EstimationContext } from '../../application/estimate/estimation-context.ts'
import type { EstimationError } from '../../application/estimate/estimation-error.ts'
import {
  toEstimateResult,
  type EstimateResult,
} from '../../application/estimate/estimate-result.ts'
import { parseTerritorialLeverRequest } from '../../application/estimate/parse-request.ts'
import { readHeatNetworks } from '../../application/heat-networks/read-heat-networks.ts'
import { calculateReseauxChaleurReduction } from './calculate-reseaux-chaleur-reduction.ts'
import {
  reseauxChaleurRequestSchema,
  type ReseauxChaleurRequestInput,
} from './reseaux-chaleur-request.ts'

function estimate(
  input: ReseauxChaleurRequestInput,
  { dataSource, getCommunesOf }: EstimationContext,
): Result<EstimateResult, EstimationError> {
  return parseTerritorialLeverRequest(reseauxChaleurRequestSchema, input).andThen(({ territory, parameters }) =>
    getCommunesOf(territory)
      .andThen((communes) => readHeatNetworks({ dataSource, communes }))
      .map((networks) =>
        toEstimateResult(
          calculateReseauxChaleurReduction({
            reductionFraction: parameters.emissionFactorReductionFraction,
            networks,
          }),
        ),
      ),
  )
}

export { estimate }
