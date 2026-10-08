import type { Result } from 'neverthrow'
import type { EstimationContext } from '../../application/estimate/estimation-context.ts'
import type { EstimationError } from '../../application/estimate/estimation-error.ts'
import {
  toEstimateResult,
  type EstimateResult,
} from '../../application/estimate/estimate-result.ts'
import { parseLeverRequest } from '../../application/estimate/parse-request.ts'
import { calculateReseauxChaleurReduction } from './calculate-reseaux-chaleur-reduction.ts'
import { readHeatNetworks } from './read-heat-networks.ts'
import {
  reseauxChaleurRequestSchema,
  type ReseauxChaleurRequestInput,
} from './reseaux-chaleur-request.ts'

function estimate(
  input: ReseauxChaleurRequestInput,
  { dataSource, territoryIndex }: EstimationContext,
): Result<EstimateResult, EstimationError> {
  return parseLeverRequest(reseauxChaleurRequestSchema, input).andThen(({ territory, parameters }) =>
    territoryIndex()
      .andThen((index) => index.communesOf(territory))
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
