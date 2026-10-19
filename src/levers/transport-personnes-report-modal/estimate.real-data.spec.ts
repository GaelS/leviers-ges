import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createEstimationContext } from '../../application/estimate/create-estimation-context.ts'
import type { ComputedLevels } from '../../domain/lever-registry.ts'
import { createCsvDataSource } from '../../infrastructure/csv/csv-data-source.ts'
import { estimate } from './estimate.ts'
import {
  transportPersonnesReportModalRequestSchema,
  type TransportPersonnesReportModalRequest,
} from './transport-personnes-report-modal-request.ts'

type Level = ComputedLevels<'transport_personnes_report_modal'>

type Parameters = {
  readonly carToPublicTransportFraction: string
  readonly carToActiveModesFraction: string
  readonly railShareFraction?: string
}

const context = createEstimationContext(
  createCsvDataSource(join(import.meta.dirname, '..', '..', '..', 'data')),
)

const MIXED_SHIFT: Parameters = {
  carToPublicTransportFraction: '0.1',
  carToActiveModesFraction: '0.05',
}

function toRequest({
  level,
  code,
  parameters,
}: {
  level: Level
  code: string
  parameters: Parameters
}): TransportPersonnesReportModalRequest {
  const parsed = transportPersonnesReportModalRequestSchema.parse({
    id: 'transport_personnes_report_modal',
    territory: { level, code },
    parameters,
  })
  return { ...parsed, territory: { ...parsed.territory, level } }
}

function estimation(target: { level: Level; code: string; parameters: Parameters }) {
  return estimate(toRequest(target), context)._unsafeUnwrap()
}

describe('estimate transport_personnes_report_modal, Insee-SDES 2022 et parc SDES 2025', () => {
  it.each([
    ['region', '84', '207826.72'],
    ['region', '53', '99531.56'],
    ['region', '11', '229901.3'],
    ['region', '94', '5437.77'],
    ['departement', '69', '40895.57'],
    ['departement', '75', '18356.06'],
    ['departement', '2A', '2522.32'],
    ['epci', '200046977', '27094.4'],
  ] as const)(
    'à 10 %% vers les transports en commun et 5 %% vers les modes actifs, le niveau %s %s évite %s tCO2e',
    (level, code, expected) => {
      expect(estimation({ level, code, parameters: MIXED_SHIFT }).reduction.toFixed()).toBe(expected)
    },
  )

  it('avec 60 % de ferré saisi, la région 84 évite 235 784,77 tCO2e', () => {
    const parameters = { ...MIXED_SHIFT, railShareFraction: '0.6' }
    expect(estimation({ level: 'region', code: '84', parameters }).reduction.toFixed()).toBe(
      '235784.77',
    )
  })

  it('la Corse prend le facteur du train de Corse, la Bretagne celui du TER', () => {
    const railFactorOf = (code: string) =>
      estimation({ level: 'region', code, parameters: MIXED_SHIFT }).appliedAssumptions[
        'railEmissionFactor'
      ]?.value
    expect({ corse: railFactorOf('94'), bretagne: railFactorOf('53') }).toEqual({
      corse: '0.187',
      bretagne: '0.0229',
    })
  })

  it.each([
    ['region', '01'],
    ['departement', '971'],
  ] as const)('refuse %s %s, outre-mer absent des données', (level, code) => {
    const request = toRequest({ level, code, parameters: MIXED_SHIFT })
    expect(estimate(request, context)._unsafeUnwrapErr()).toMatchObject({ kind: 'missing_data' })
  })
})
