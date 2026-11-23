import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createEstimationContext } from '../../application/estimate/create-estimation-context.ts'
import { sum, toBig } from '../../domain/big-number.ts'
import type { ComputedLevels } from '../../domain/lever-registry.ts'
import { createCsvDataSource } from '../../infrastructure/csv/csv-data-source.ts'
import { estimate } from './estimate.ts'
import {
  residentielChangementSystemeChauffageRequestSchema,
  type ResidentielChangementSystemeChauffageRequest,
} from './residentiel-changement-systeme-chauffage-request.ts'

type Level = ComputedLevels<'residentiel_changement_systeme_chauffage'>

const dataSource = createCsvDataSource(join(import.meta.dirname, '..', '..', '..', 'data'))
const context = createEstimationContext(dataSource)

const regions = dataSource.rows('residentiel-sobriete/regions')._unsafeUnwrap()
const departements = dataSource.rows('residentiel-sobriete/departements')._unsafeUnwrap()
const epcis = dataSource.rows('residentiel-sobriete/epcis')._unsafeUnwrap()

const TARGET = {
  targetElectricityShareFraction: '0.5',
  targetNaturalGasShareFraction: '0.1',
  targetFuelOilShareFraction: '0',
  targetWoodShareFraction: '0.1',
  targetHeatNetworkShareFraction: '0.3',
}

function toRequest({ level, code }: { level: Level; code: string }): ResidentielChangementSystemeChauffageRequest {
  const parsed = residentielChangementSystemeChauffageRequestSchema.parse({
    id: 'residentiel_changement_systeme_chauffage',
    territory: { level, code },
    parameters: TARGET,
  })
  return { ...parsed, territory: { ...parsed.territory, level } }
}

function reduction(target: { level: Level; code: string }): string {
  return estimate(toRequest(target), context)._unsafeUnwrap().reduction.toFixed()
}

describe('estimate residentiel_changement_systeme_chauffage, parts nationales SDES 2024 et rendements ADEME', () => {
  it.each([
    ['region', '84', '2258646.2'],
    ['region', '53', '722584.1'],
    ['region', '11', '3138837.12'],
    ['departement', '01', '167981.57'],
    ['departement', '35', '223883.82'],
    ['departement', '75', '541853.66'],
    ['departement', '69', '575054.33'],
    ['departement', '2A', '-44.83'],
    ['epci', '200000172', '10450.5'],
    ['epci', '200000438', '7335.68'],
  ] as const)(
    'à une cible de 50 %% d’électricité, 10 %% de gaz, 10 %% de bois et 30 %% de réseau, le niveau %s %s évite %s tCO2e',
    (level, code, expected) => {
      expect(reduction({ level, code })).toBe(expected)
    },
  )

  it('les 13 régions évitent 17 122 529,66 tCO2e', () => {
    const reductions = regions.map((row) =>
      reduction({ level: 'region', code: row['code_region'] ?? '' }),
    )
    expect(reductions).toHaveLength(13)
    expect(sum(reductions.map((value) => toBig(value))).toFixed()).toBe('17122529.66')
  })

  it('les 96 départements évitent 17 363 584,1 tCO2e', () => {
    const reductions = departements.map((row) =>
      reduction({ level: 'departement', code: row['code_departement'] ?? '' }),
    )
    expect(reductions).toHaveLength(96)
    expect(sum(reductions.map((value) => toBig(value))).toFixed()).toBe('17363584.1')
  })

  it('1 232 des 1 255 EPCI évitent 18 372 662,62 tCO2e, les 23 EPCI d’outre-mer sans parc de logements sont refusés', () => {
    const outcomes = epcis.map((row) =>
      estimate(toRequest({ level: 'epci', code: row['code_epci'] ?? '' }), context),
    )
    const computed = outcomes.flatMap((outcome) => (outcome.isOk() ? [outcome.value.reduction] : []))
    const refused = outcomes.flatMap((outcome) => (outcome.isErr() ? [outcome.error] : []))
    expect(computed).toHaveLength(1232)
    expect(sum(computed).toFixed()).toBe('18372662.62')
    expect(refused).toHaveLength(23)
    expect(refused.every((error) => error.kind === 'missing_data')).toBe(true)
  })
})
