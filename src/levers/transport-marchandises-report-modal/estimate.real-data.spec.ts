import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createEstimationContext } from '../../application/estimate/create-estimation-context.ts'
import { createCsvDataSource } from '../../infrastructure/csv/csv-data-source.ts'
import { estimate } from './estimate.ts'
import {
  transportMarchandisesReportModalRequestSchema,
  type TransportMarchandisesReportModalRequest,
} from './transport-marchandises-report-modal-request.ts'

const context = createEstimationContext(
  createCsvDataSource(join(import.meta.dirname, '..', '..', '..', 'data')),
)

function toRequest({
  code,
  cyclologisticTonneKilometres,
}: {
  code: string
  cyclologisticTonneKilometres?: string
}): TransportMarchandisesReportModalRequest {
  const parsed = transportMarchandisesReportModalRequestSchema.parse({
    id: 'transport_marchandises_report_modal',
    territory: { level: 'region', code },
    parameters: {
      roadToRailFraction: '0.1',
      roadToWaterwayFraction: '0.05',
      cyclologisticTonneKilometres,
    },
  })
  return { ...parsed, territory: { ...parsed.territory, level: 'region' } }
}

describe('estimate transport_marchandises_report_modal, SDES 2024 et OMINEA 2024', () => {
  it.each([
    ['84', '349026.87'],
    ['53', '148969.67'],
    ['11', '232640.89'],
    ['94', '2598.45'],
    ['32', '329251.63'],
  ])('à 10 %% de ferroviaire et 5 %% de fluvial, la région %s évite %s tCO2e', (code, expected) => {
    expect(estimate(toRequest({ code }), context)._unsafeUnwrap().reduction.toFixed()).toBe(expected)
  })

  it.each([
    ['84', '337862.65'],
    ['53', '137770'],
    ['11', '221494.9'],
    ['94', '-8435.83'],
    ['32', '318001.91'],
  ])(
    'avec un milliard de t.km de cyclologistique, la région %s évite %s tCO2e',
    (code, expected) => {
      const request = toRequest({ code, cyclologisticTonneKilometres: '1000000000' })
      expect(estimate(request, context)._unsafeUnwrap().reduction.toFixed()).toBe(expected)
    },
  )

  it('refuse l’outre-mer, absent des données', () => {
    expect(estimate(toRequest({ code: '01' }), context)._unsafeUnwrapErr()).toMatchObject({
      kind: 'missing_data',
    })
  })
})
