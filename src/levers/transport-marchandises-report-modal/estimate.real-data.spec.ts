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
    ['84', '248249.26'],
    ['53', '106147.13'],
    ['11', '165986.06'],
    ['94', '1838.05'],
    ['32', '235219.05'],
  ])('à 10 %% de ferroviaire et 5 %% de fluvial, la région %s évite %s tCO2e', (code, expected) => {
    expect(estimate(toRequest({ code }), context)._unsafeUnwrap().reduction.toFixed()).toBe(expected)
  })

  it.each([
    ['84', '240308.58'],
    ['53', '98166.91'],
    ['11', '158033.55'],
    ['94', '-5967.19'],
    ['32', '227182.2'],
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
