import type { Result } from 'neverthrow'
import type { EstimationContext } from '../../application/estimate/estimation-context.js'
import type { EstimationError } from '../../application/estimate/estimation-error.js'
import {
  toEstimateResult,
  type EstimateResult,
} from '../../application/estimate/estimate-result.js'
import { parseLeverRequest } from '../../application/estimate/parse-request.js'
import { calculateReseauxChaleurReduction } from './calculate-reseaux-chaleur-reduction.js'
import { readHeatNetworks } from './read-heat-networks.js'
import {
  reseauxChaleurRequestSchema,
  type ReseauxChaleurRequestInput,
} from './reseaux-chaleur-request.js'

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
