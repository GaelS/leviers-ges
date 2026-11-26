import { describe, expect, it } from 'vitest'
import { createDefaultEstimator } from '../create-default-estimator.ts'

const estimate = createDefaultEstimator()

const fretRequest = {
  id: 'transport_marchandises_report_modal',
  territory: { level: 'region', code: '84' },
  parameters: { roadToRailFraction: '0.1', roadToWaterwayFraction: '0.05' },
}

describe('Estimate renvoyé par l’estimateur', () => {
  it('est gelé, avec ses limites, ses jeux de données et ses hypothèses', () => {
    const result = estimate(fretRequest)._unsafeUnwrap()

    expect(Object.isFrozen(result)).toBe(true)
    expect(Object.isFrozen(result.limits)).toBe(true)
    expect(result.limits.every((limit) => Object.isFrozen(limit))).toBe(true)
    expect(Object.isFrozen(result.datasets)).toBe(true)
    expect(result.datasets.every((dataset) => Object.isFrozen(dataset))).toBe(true)
    expect(Object.isFrozen(result.appliedAssumptions)).toBe(true)
    expect(Object.values(result.appliedAssumptions).every((assumption) => Object.isFrozen(assumption))).toBe(true)
  })

  it('refuse qu’un appelant modifie une limite ou le tableau des limites', () => {
    const result = estimate(fretRequest)._unsafeUnwrap()

    expect(() => Object.assign(result.limits[0] ?? {}, { limit: 'modifiée' })).toThrow(TypeError)
    expect(() => Object.assign(result.limits, { 0: 'modifiée' })).toThrow(TypeError)
    expect(result.limits[0]?.limit).not.toBe('modifiée')
  })

  it('ne partage aucune limite entre deux appels : la modification d’une copie n’atteint pas l’autre résultat', () => {
    const first = estimate(fretRequest)._unsafeUnwrap()
    const second = estimate(fretRequest)._unsafeUnwrap()
    expect(first.limits).not.toBe(second.limits)
    expect(first.limits).toEqual(second.limits)
  })

  it('gèle aussi le résultat d’un levier sans territoire', () => {
    const result = estimate({ id: 'haies', parameters: { hedgeKmCreatedPerYear: '10' } })._unsafeUnwrap()
    expect(Object.isFrozen(result)).toBe(true)
    expect(Object.isFrozen(result.appliedAssumptions)).toBe(true)
  })

  it('se sérialise en JSON sans copie', () => {
    const result = estimate(fretRequest)._unsafeUnwrap()
    expect(JSON.parse(JSON.stringify(result))).toMatchObject({ status: 'workaround', reduction: result.reduction })
  })
})
