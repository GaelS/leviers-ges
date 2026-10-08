import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createEstimationContext } from '../../application/estimate/create-estimation-context.ts'
import { sum, toBig } from '../../domain/big-number.ts'
import type { ComputedLevels } from '../../domain/lever-registry.ts'
import { createCsvDataSource } from '../../infrastructure/csv/csv-data-source.ts'
import { estimate } from './estimate.ts'
import {
  residentielSobrieteRequestSchema,
  type ResidentielSobrieteRequest,
} from './residentiel-sobriete-request.ts'

type Level = ComputedLevels<'residentiel_sobriete'>

type Parameters = {
  readonly householdsApplyingSobrietyFraction: string
  readonly consumptionReductionFraction: string
}

const dataSource = createCsvDataSource(join(import.meta.dirname, '..', '..', '..', 'data'))
const context = createEstimationContext(dataSource)

const regions = dataSource.rows('residentiel-sobriete/regions')._unsafeUnwrap()
const departements = dataSource.rows('residentiel-sobriete/departements')._unsafeUnwrap()

const FULL: Parameters = {
  householdsApplyingSobrietyFraction: '1',
  consumptionReductionFraction: '1',
}

const HALF_OF_HOUSEHOLDS_TEN_PERCENT_LESS: Parameters = {
  householdsApplyingSobrietyFraction: '0.5',
  consumptionReductionFraction: '0.1',
}

function toRequest({
  level,
  code,
  parameters,
}: {
  level: Level
  code: string
  parameters: Parameters
}): ResidentielSobrieteRequest {
  const parsed = residentielSobrieteRequestSchema.parse({
    id: 'residentiel_sobriete',
    territory: { level, code },
    parameters,
  })
  return { ...parsed, territory: { ...parsed.territory, level } }
}

function reduction(target: { level: Level; code: string; parameters: Parameters }): string {
  return estimate(toRequest(target), context)._unsafeUnwrap().reduction.toFixed()
}

describe('estimate residentiel_sobriete, énergie SDES 2024, CEREN 2024 et réseaux de chaleur SDES 2024', () => {
  it.each([
    ['region', '84', '5027015.09'],
    ['region', '53', '1894270.79'],
    ['region', '11', '7346387.73'],
    ['region', '94', '70676.7'],
    ['departement', '01', '380420.66'],
    ['departement', '35', '607488.23'],
    ['departement', '75', '1349053.38'],
    ['departement', '69', '1211601.1'],
    ['departement', '2A', '29107.1'],
    ['departement', '48', '73097.08'],
  ] as const)(
    'à 100 %% des foyers et 100 %% de baisse, le niveau %s %s évite %s tCO2e',
    (level, code, expected) => {
      expect(reduction({ level, code, parameters: FULL })).toBe(expected)
    },
  )

  it.each([
    ['region', '84', '251350.75'],
    ['departement', '35', '30374.41'],
  ] as const)(
    'à 50 %% des foyers et 10 %% de baisse, le niveau %s %s évite 5 %% du maximum : %s tCO2e',
    (level, code, expected) => {
      expect(reduction({ level, code, parameters: HALF_OF_HOUSEHOLDS_TEN_PERCENT_LESS })).toBe(expected)
    },
  )

  it('la Corse-du-Sud n’a ni gaz ni réseau de chaleur : seuls l’électricité, le fioul et le GPL comptent', () => {
    expect(reduction({ level: 'departement', code: '2A', parameters: FULL })).toBe('29107.1')
  })

  it('les 13 régions de métropole évitent 39 495 128,07 tCO2e à 100 %', () => {
    const regionalReductions = regions.map((row) =>
      toBig(reduction({ level: 'region', code: row['code_region'] ?? '', parameters: FULL })),
    )
    expect(regions).toHaveLength(13)
    expect(sum(regionalReductions).toFixed()).toBe('39495128.07')
  })

  it('les 96 départements de métropole évitent 39 937 077,48 tCO2e à 100 %, 1,1 % de plus que les régions', () => {
    const departmentalReductions = departements.map((row) =>
      toBig(reduction({ level: 'departement', code: row['code_departement'] ?? '', parameters: FULL })),
    )
    expect(departements).toHaveLength(96)
    expect(sum(departmentalReductions).toFixed()).toBe('39937077.48')
  })

  it.each([
    ['region', '01'],
    ['departement', '971'],
  ] as const)('refuse %s %s, outre-mer absent des données énergétiques', (level, code) => {
    const request = toRequest({ level, code, parameters: FULL })
    expect(estimate(request, context)._unsafeUnwrapErr()).toMatchObject({ kind: 'missing_data' })
  })
})
