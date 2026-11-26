import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createEstimationContext } from '../../application/estimate/create-estimation-context.ts'
import { sum, toBig } from '../../domain/big-number.ts'
import type { ComputedLevels } from '../../domain/lever-registry.ts'
import { createCsvDataSource } from '../../infrastructure/csv/csv-data-source.ts'
import { estimate } from './estimate.ts'
import {
  residentielRenovationRequestSchema,
  type ResidentielRenovationRequest,
} from './residentiel-renovation-request.ts'

type Level = ComputedLevels<'residentiel_renovation'>

const dataSource = createCsvDataSource(join(import.meta.dirname, '..', '..', '..', 'data'))
const context = createEstimationContext(dataSource)

const regions = dataSource.rows('residentiel-sobriete/regions')._unsafeUnwrap()
const departements = dataSource.rows('residentiel-sobriete/departements')._unsafeUnwrap()
const epcis = dataSource.rows('residentiel-sobriete/epcis')._unsafeUnwrap()

function toRequest({ level, code }: { level: Level; code: string }): ResidentielRenovationRequest {
  const parsed = residentielRenovationRequestSchema.parse({
    id: 'residentiel_renovation',
    territory: { level, code },
    parameters: { renovatedParcFraction: '0.5' },
  })
  return { ...parsed, territory: { ...parsed.territory, level } }
}

function reduction(target: { level: Level; code: string }): string {
  return estimate(toRequest(target), context)._unsafeUnwrap().reduction.toFixed()
}

describe('estimate residentiel_renovation, parts nationales SDES 2024, parc INSEE RP2022 et −35 %', () => {
  it.each([
    ['region', '84', '758678.64'],
    ['region', '53', '263322.89'],
    ['region', '11', '1229639.44'],
    ['departement', '01', '55022.18'],
    ['departement', '35', '91957.14'],
    ['departement', '75', '238667.11'],
    ['departement', '69', '195850.54'],
    ['departement', '2A', '1489.39'],
    ['epci', '200000172', '3160.76'],
    ['epci', '200000438', '2081.5'],
  ] as const)(
    'à 50 %% du parc rénové, le niveau %s %s évite %s tCO2e',
    (level, code, expected) => {
      expect(reduction({ level, code })).toBe(expected)
    },
  )

  it('les 13 régions évitent 4 480 136,54 tCO2e', () => {
    const reductions = regions.map((row) => toBig(reduction({ level: 'region', code: row['code_region'] ?? '' })))
    expect(reductions).toHaveLength(13)
    expect(sum(reductions).toFixed()).toBe('5944100.07')
  })

  it('les 96 départements évitent 4 523 488,05 tCO2e', () => {
    const reductions = departements.map((row) =>
      toBig(reduction({ level: 'departement', code: row['code_departement'] ?? '' })),
    )
    expect(reductions).toHaveLength(96)
    expect(sum(reductions).toFixed()).toBe('6006703.8')
  })

  it('1 232 des 1 255 EPCI évitent 4 528 519,95 tCO2e, les 23 EPCI d’outre-mer sans parc de logements sont refusés', () => {
    const outcomes = epcis.map((row) =>
      estimate(toRequest({ level: 'epci', code: row['code_epci'] ?? '' }), context),
    )
    const computed = outcomes.flatMap((outcome) => (outcome.isOk() ? [outcome.value.reduction] : []))
    const refused = outcomes.flatMap((outcome) => (outcome.isErr() ? [outcome.error] : []))
    expect(computed).toHaveLength(1232)
    expect(sum(computed).toFixed()).toBe('6002022.08')
    expect(refused).toHaveLength(23)
    expect(refused.every((error) => error.kind === 'missing_data')).toBe(true)
  })
})
