import type { LeverId } from '../../domain/lever-registry.js'
import type { Level } from '../../domain/territory.js'

type InvalidRequest = {
  readonly kind: 'invalid_request'
  readonly issues: ReadonlyArray<{ readonly parameter: string; readonly message: string }>
}

type LevelNotComputed = {
  readonly kind: 'level_not_computed'
  readonly lever: LeverId
  readonly level: Level
}

type EstimationError = InvalidRequest | LevelNotComputed

function invalidRequest(issues: InvalidRequest['issues']): InvalidRequest {
  return { kind: 'invalid_request', issues }
}

function levelNotComputed({ lever, level }: Pick<LevelNotComputed, 'lever' | 'level'>): LevelNotComputed {
  return { kind: 'level_not_computed', lever, level }
}

export { invalidRequest, levelNotComputed }
export type { EstimationError, InvalidRequest, LevelNotComputed }
