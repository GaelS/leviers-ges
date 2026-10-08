import type { InvalidDatasetReason } from '../../domain/data-source.ts'

type Violation = {
  readonly reason: InvalidDatasetReason
  readonly detail: string
}

function violation(reason: InvalidDatasetReason, detail: string): Violation {
  return { reason, detail }
}

export { violation }
export type { Violation }
