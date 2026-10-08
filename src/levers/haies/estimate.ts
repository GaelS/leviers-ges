import type { Result } from 'neverthrow'
import type { EstimateResult } from '../../application/estimate/estimate-result.js'
import { toEstimateResult } from '../../application/estimate/estimate-result.js'
import type { EstimationError } from '../../application/estimate/estimation-error.js'
import { parseLeverRequest } from '../../application/estimate/parse-request.js'
import { calculateHaiesReduction, HEDGE_STORAGE_FACTOR } from './calculate-haies-reduction.js'
import { haiesRequestSchema, type HaiesRequestInput } from './haies-request.js'

function estimate(input: HaiesRequestInput): Result<EstimateResult, EstimationError> {
  return parseLeverRequest(haiesRequestSchema, input).map(({ parameters }) =>
    toEstimateResult(calculateHaiesReduction(parameters.hedgeKmCreatedPerYear, HEDGE_STORAGE_FACTOR)),
  )
}

export { estimate }
