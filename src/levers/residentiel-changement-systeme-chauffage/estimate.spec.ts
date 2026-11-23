import { describe, expect, it } from 'vitest'
import { createEstimationContext } from '../../application/estimate/create-estimation-context.ts'
import type { DataRow } from '../../domain/data-source.ts'
import type { ComputedLevels } from '../../domain/lever-registry.ts'
import { createTemporaryCsvDataSource } from '../../testing/temporary-csv-data-source.ts'
import { estimate } from './estimate.ts'
import {
  residentielChangementSystemeChauffageRequestSchema,
  type ResidentielChangementSystemeChauffageRequest,
} from './residentiel-changement-systeme-chauffage-request.ts'

type Level = ComputedLevels<'residentiel_changement_systeme_chauffage'>

type TargetShares = {
  readonly targetElectricityShareFraction: string
  readonly targetNaturalGasShareFraction: string
  readonly targetFuelOilShareFraction: string
  readonly targetWoodShareFraction: string
  readonly targetHeatNetworkShareFraction: string
}

const TARGET: TargetShares = {
  targetElectricityShareFraction: '0.5',
  targetNaturalGasShareFraction: '0.1',
  targetFuelOilShareFraction: '0',
  targetWoodShareFraction: '0.1',
  targetHeatNetworkShareFraction: '0.3',
}

const HOUSING_TYPES = ['house', 'private_apartment', 'social_apartment']

const CONSTRUCTION_PERIODS = ['before_1971', '1971_to_2005', 'after_2005']

function housingSurfaces(): DataRow {
  const zeros = HOUSING_TYPES.flatMap((type) =>
    CONSTRUCTION_PERIODS.flatMap((period): [string, string][] => [
      [`housing_m2_${type}_fuel_oil_${period}`, '0'],
      [`housing_m2_${type}_lpg_${period}`, '0'],
    ]),
  )
  const row: Record<string, string> = Object.fromEntries(zeros)
  return { ...row, housing_m2_house_fuel_oil_before_1971: '400', housing_m2_house_lpg_before_1971: '200' }
}

const dataSource = createTemporaryCsvDataSource({
  'territoires/communes': {
    keyColumn: 'code_commune',
    rows: [
      { code_commune: '01001', code_epci: '200000001', code_departement: '01', code_region: '84' },
      { code_commune: '01002', code_epci: '200000001', code_departement: '01', code_region: '84' },
      { code_commune: '69001', code_epci: '200000002', code_departement: '69', code_region: '84' },
    ],
  },
  'residentiel-sobriete/regions': {
    keyColumn: 'code_region',
    level: 'region',
    rows: [
      {
        code_region: '84',
        electricity_gwh: '10',
        natural_gas_gwh: '4',
        fuel_oil_gwh: '20',
        lpg_gwh: '5',
        heat_gwh: '3',
      },
    ],
  },
  'residentiel-sobriete/departements': {
    keyColumn: 'code_departement',
    level: 'departement',
    rows: [
      {
        code_departement: '01',
        electricity_mwh: '2000',
        natural_gas_mwh: '500',
        fuel_oil_mwh: '1000',
        lpg_mwh: '400',
      },
    ],
  },
  'residentiel-sobriete/epcis': {
    keyColumn: 'code_epci',
    level: 'epci',
    rows: [{ code_epci: '200000001', electricity_mwh: '2000', natural_gas_mwh: '500' }],
  },
  'residentiel-logements/logements-epci-departement': {
    keyColumn: 'epci_departement',
    rows: [
      {
        epci_departement: '200000001-01',
        code_epci: '200000001',
        code_departement: '01',
        ...housingSurfaces(),
      },
    ],
  },
  'residentiel-logements/logements-departement': {
    keyColumn: 'code_departement',
    level: 'departement',
    rows: [{ code_departement: '01', ...housingSurfaces() }],
  },
  'residentiel-sobriete/heat-networks': {
    keyColumn: 'network_id',
    rows: [
      { network_id: 'A', commune_code: '01001', delivered_mwh: '1000', emission_factor_kg_per_kwh: '0.1' },
      { network_id: 'B', commune_code: '69001', delivered_mwh: '500', emission_factor_kg_per_kwh: '0.2' },
      { network_id: 'C', commune_code: '01002', delivered_mwh: '3000', emission_factor_kg_per_kwh: '0.2' },
    ],
  },
})

const context = createEstimationContext(dataSource)

function request(level: Level, code: string): ResidentielChangementSystemeChauffageRequest {
  const parsed = residentielChangementSystemeChauffageRequestSchema.parse({
    id: 'residentiel_changement_systeme_chauffage',
    territory: { level, code },
    parameters: TARGET,
  })
  return { ...parsed, territory: { ...parsed.territory, level } }
}

describe('estimate, residentiel_changement_systeme_chauffage', () => {
  it.each([
    ['la région 84', 'region', '84', '4005.49'],
    ['le département 01', 'departement', '01', '498.32'],
    ['l’EPCI 200000001, qui couvre tout le département 01', 'epci', '200000001', '498.32'],
  ] as const)('évite pour %s : %s tCO2e par an', (_label, level, code, expected) => {
    expect(estimate(request(level, code), context)._unsafeUnwrap().reduction.toFixed()).toBe(expected)
  })

  it('déclare la part nationale du chauffage comme hypothèse appliquée', () => {
    const { appliedAssumptions } = estimate(request('departement', '01'), context)._unsafeUnwrap()
    expect(Object.keys(appliedAssumptions)).toEqual(['nationalHeatingShares'])
    expect(appliedAssumptions['nationalHeatingShares']?.limit).toContain('LPG consumption is left unchanged')
  })

  it('refuse un département absent des données', () => {
    expect(estimate(request('departement', '99'), context)._unsafeUnwrapErr()).toMatchObject({
      kind: 'unknown_territory',
    })
  })

  it('refuse un EPCI sans consommation', () => {
    expect(estimate(request('epci', '200000002'), context)._unsafeUnwrapErr()).toMatchObject({
      kind: 'missing_data',
      dataset: 'residentiel-sobriete/epcis',
    })
  })
})

describe('residentielChangementSystemeChauffageRequestSchema', () => {
  function parse(parameters: Record<string, string>) {
    return residentielChangementSystemeChauffageRequestSchema.safeParse({
      id: 'residentiel_changement_systeme_chauffage',
      territory: { level: 'departement', code: '01' },
      parameters,
    })
  }

  it('accepte cinq parts qui font 100 %', () => {
    expect(parse(TARGET).success).toBe(true)
  })

  it('refuse des parts qui ne font pas 100 %', () => {
    const result = parse({ ...TARGET, targetWoodShareFraction: '0.2' })
    expect(result.error?.issues[0]).toMatchObject({
      path: ['parameters', 'targetHeatNetworkShareFraction'],
      message: 'the five target shares must add up to 100%',
    })
  })

  it('refuse une part hors de 0 à 1 sans masquer l’erreur par celle de la somme', () => {
    const result = parse({ ...TARGET, targetWoodShareFraction: '1.5' })
    expect(result.error?.issues.map((issue) => issue.path.join('.'))).toEqual([
      'parameters.targetWoodShareFraction',
    ])
  })
})
