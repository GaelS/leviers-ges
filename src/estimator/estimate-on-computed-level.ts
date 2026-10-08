import type { Result } from 'neverthrow'
import { ensureLevelComputed } from '../application/estimate/ensure-level-computed.ts'
import type { EstimateResult } from '../application/estimate/estimate-result.ts'
import type { EstimationError } from '../application/estimate/estimation-error.ts'
import type { LeverId } from '../domain/lever-registry.ts'
import type { Level } from '../domain/territory.ts'

type TerritorialRequest = {
  readonly id: LeverId
  readonly territory: { readonly level: Level }
}

function estimateOnComputedLevel<R extends TerritorialRequest>(
  request: R,
  estimateLever: (request: R) => Result<EstimateResult, EstimationError>,
): Result<EstimateResult, EstimationError> {
  return ensureLevelComputed({ lever: request.id, level: request.territory.level }).andThen(() =>
    estimateLever(request),
  )
}

export { estimateOnComputedLevel }
