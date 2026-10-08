import type { Result } from 'neverthrow'
import type { EstimateResult } from '../../application/estimate/estimate-result.ts'
import { toEstimateResult } from '../../application/estimate/estimate-result.ts'
import type { EstimationError } from '../../application/estimate/estimation-error.ts'
import { parseLeverRequest } from '../../application/estimate/parse-request.ts'
import { calculateHaiesReduction, HEDGE_STORAGE_FACTOR } from './calculate-haies-reduction.ts'
import { haiesRequestSchema, type HaiesRequestInput } from './haies-request.ts'

function estimate(input: HaiesRequestInput): Result<EstimateResult, EstimationError> {
  return parseLeverRequest(haiesRequestSchema, input).map(({ parameters }) =>
    toEstimateResult(calculateHaiesReduction(parameters.hedgeKmCreatedPerYear, HEDGE_STORAGE_FACTOR)),
  )
}

export { estimate }
