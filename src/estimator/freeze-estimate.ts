import { mapValues } from 'es-toolkit'
import type { Estimate } from './estimate.ts'

function freezeEntries<T extends object>(entries: readonly T[]): readonly T[] {
  return Object.freeze(entries.map((entry) => Object.freeze({ ...entry })))
}

function freezeEstimate(estimate: Estimate): Estimate {
  return Object.freeze({
    ...estimate,
    limits: freezeEntries(estimate.limits),
    datasets: freezeEntries(estimate.datasets),
    appliedAssumptions: Object.freeze(
      mapValues(estimate.appliedAssumptions, (assumption) => Object.freeze({ ...assumption })),
    ),
  })
}

export { freezeEstimate }
