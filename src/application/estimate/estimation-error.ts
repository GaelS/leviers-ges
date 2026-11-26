import type { DataSourceError } from '../../domain/data-source.ts'
import type { LeverId } from '../../domain/lever-registry.ts'
import type { Level } from '../../domain/territory.ts'
import type { UnknownTerritory } from '../../domain/territory-index.ts'

type InvalidRequest = {
  readonly kind: 'invalid_request'
  readonly issues: ReadonlyArray<{ readonly parameter: string; readonly message: string }>
}

type LevelNotComputed = {
  readonly kind: 'level_not_computed'
  readonly lever: LeverId
  readonly level: Level
}

type EstimationError = InvalidRequest | LevelNotComputed | UnknownTerritory | DataSourceError

type EstimationErrorKind = EstimationError['kind']

// Source : choix de conception, non validé : les cinq kind d'EstimationError, exposés pour que les consommateurs dérivent leurs tables d'erreurs ; un test vérifie que la liste couvre le type
const ESTIMATION_ERROR_KINDS = [
  'invalid_request',
  'level_not_computed',
  'unknown_territory',
  'missing_data',
  'invalid_dataset',
] as const satisfies readonly EstimationErrorKind[]

function invalidRequest(issues: InvalidRequest['issues']): InvalidRequest {
  return { kind: 'invalid_request', issues }
}

function levelNotComputed({ lever, level }: Pick<LevelNotComputed, 'lever' | 'level'>): LevelNotComputed {
  return { kind: 'level_not_computed', lever, level }
}

export { ESTIMATION_ERROR_KINDS, invalidRequest, levelNotComputed }
export type { EstimationError, EstimationErrorKind, InvalidRequest, LevelNotComputed }
