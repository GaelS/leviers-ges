import { describe, expect, it } from 'vitest'
import { createDefaultEstimator } from './create-default-estimator.ts'

describe('createDefaultEstimator', () => {
  const estimate = createDefaultEstimator()

  it('calcule sur les données livrées avec le paquet', () => {
    const result = estimate({ id: 'haies', parameters: { hedgeKmCreatedPerYear: '100' } })

    expect(result._unsafeUnwrap().reduction).toBe('117')
  })

  it.each([
    ['10', '11.7'],
    ['10.123', '11.84'],
    ['10.125', '11.85'],
    ['0.001', '0'],
    ['1234567.891', '1444444.43'],
  ])('renvoie la réduction de %s km de haies en texte décimal arrondi à deux décimales : %s', (km, expected) => {
    const result = estimate({ id: 'haies', parameters: { hedgeKmCreatedPerYear: km } })

    expect(result._unsafeUnwrap().reduction).toBe(expected)
  })

  it('lit un jeu de données territorial livré avec le paquet', () => {
    const result = estimate({
      id: 'transport_marchandises_report_modal',
      territory: { level: 'region', code: '84' },
      parameters: { roadToRailFraction: '0.1', roadToWaterwayFraction: '0.05' },
    })

    expect(result._unsafeUnwrap().datasets.length).toBeGreaterThan(0)
  })

  it('refuse une requête inconnue au lieu de lever', () => {
    expect(estimate('pas une requête')._unsafeUnwrapErr().kind).toBe('invalid_request')
    expect(estimate({ id: 'inconnu' })._unsafeUnwrapErr().kind).toBe('invalid_request')
  })
})
