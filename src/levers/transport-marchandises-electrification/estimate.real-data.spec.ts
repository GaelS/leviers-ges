import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createEstimationContext } from '../../application/estimate/create-estimation-context.ts'
import { createCsvDataSource } from '../../infrastructure/csv/csv-data-source.ts'
import { estimate } from './estimate.ts'
import {
  transportMarchandisesElectrificationRequestSchema,
  type TransportMarchandisesElectrificationRequest,
} from './transport-marchandises-electrification-request.ts'

const context = createEstimationContext(
  createCsvDataSource(join(import.meta.dirname, '..', '..', '..', 'data')),
)

function toRequest({
  code,
  share,
}: {
  code: string
  share: string
}): TransportMarchandisesElectrificationRequest {
  const parsed = transportMarchandisesElectrificationRequestSchema.parse({
    id: 'transport_marchandises_electrification',
    territory: { level: 'region', code },
    parameters: { additionalElectrifiedFleetFraction: share },
  })
  return { ...parsed, territory: { ...parsed.territory, level: 'region' } }
}

describe('estimate transport_marchandises_electrification, SDES 2024 et OMINEA 2024', () => {
  it.each([
    ['84', '205745.61'],
    ['53', '88341.34'],
    ['11', '138255.43'],
    ['94', '1498.13'],
    ['32', '197396.37'],
  ])('à 20 %% de poids lourds électrifiés en plus, la région %s évite %s tCO2e', (code, expected) => {
    expect(
      estimate(toRequest({ code, share: '0.2' }), context)._unsafeUnwrap().reduction.toFixed(),
    ).toBe(expected)
  })

  it.each([
    ['84', '1027293.05'],
    ['53', '441404.88'],
    ['11', '687885.3'],
    ['94', '7475.64'],
    ['32', '984887.69'],
  ])(
    'avec 100 %% demandés, plafonnés au parc thermique, la région %s évite %s tCO2e',
    (code, expected) => {
      const result = estimate(toRequest({ code, share: '1' }), context)._unsafeUnwrap()
      expect(result.reduction.toFixed()).toBe(expected)
      expect(result.appliedAssumptions['additionalElectrifiedFleetFraction']).toBeDefined()
    },
  )

  it('refuse l’outre-mer, absent des données', () => {
    expect(estimate(toRequest({ code: '01', share: '0.2' }), context)._unsafeUnwrapErr()).toMatchObject({
      kind: 'missing_data',
    })
  })
})
