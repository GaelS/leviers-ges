import type { Result } from 'neverthrow'
import { describe, expect, it } from 'vitest'
import { createEstimationContext } from '../../application/estimate/create-estimation-context.ts'
import type { EstimateResult } from '../../application/estimate/estimate-result.ts'
import { sum } from '../../domain/big-number.ts'
import type { DataSourceError, DataRow, DataSource } from '../../domain/data-source.ts'
import type { ComputedLevels } from '../../domain/lever-registry.ts'
import {
  createTemporaryCsvDataSource,
  type DatasetFixture,
} from '../../testing/temporary-csv-data-source.ts'
import { estimate as estimateProduitsBois } from './estimate.ts'
import { produitsBoisRequestSchema, type ProduitsBoisRequest } from './produits-bois-request.ts'

type Fixtures = Readonly<Record<string, DatasetFixture>>

function wood(code: string, logs: string, industrialWood: string, key: string): DataRow {
  return { [key]: code, logs_thousand_m3: logs, industrial_wood_thousand_m3: industrialWood }
}

const REGIONS: readonly DataRow[] = [
  wood('84', '400', '100', 'code_region'),
  wood('11', '600', '400', 'code_region'),
]

const DEPARTEMENTS: readonly DataRow[] = [
  wood('01', '100', '25', 'code_departement'),
  wood('69', '300', '75', 'code_departement'),
  wood('75', '600', '400', 'code_departement'),
]

const CONSTANTS: readonly DataRow[] = [
  { name: 'national_logs_thousand_m3', value: '1000' },
  { name: 'national_industrial_wood_thousand_m3', value: '500' },
  { name: 'timber_products_carbon_tc', value: '1000' },
  { name: 'industrial_products_carbon_tc', value: '2000' },
]

function toFixtures({
  regions = REGIONS,
  departements = DEPARTEMENTS,
  constants = CONSTANTS,
}: {
  regions?: readonly DataRow[]
  departements?: readonly DataRow[]
  constants?: readonly DataRow[]
}): Fixtures {
  return {
    'produits-bois/regions': { keyColumn: 'code_region', level: 'region', rows: regions },
    'produits-bois/departements': {
      keyColumn: 'code_departement',
      level: 'departement',
      rows: departements,
    },
    'produits-bois/constants': { keyColumn: 'name', rows: constants },
  }
}

type Estimator = (request: ProduitsBoisRequest) => Result<EstimateResult, DataSourceError>

function toEstimator(dataSource: DataSource): Estimator {
  const context = createEstimationContext(dataSource)
  return (request) => estimateProduitsBois(request, context)
}

function request(
  level: ComputedLevels<'produits_bois'>,
  code: string,
  increase = '0.12',
): ProduitsBoisRequest {
  const parsed = produitsBoisRequestSchema.parse({
    id: 'produits_bois',
    territory: { level, code },
    parameters: { woodProductionIncrease: increase },
  })
  return { ...parsed, territory: { ...parsed.territory, level } }
}

const estimate = toEstimator(createTemporaryCsvDataSource(toFixtures({})))

const estimateWithBrokenTerritory = toEstimator(
  createTemporaryCsvDataSource(
    toFixtures({ regions: [wood('84', 'beaucoup', '100', 'code_region')] }),
  ),
)

const estimateWithBrokenConstant = toEstimator(
  createTemporaryCsvDataSource(
    toFixtures({ constants: [{ name: 'national_logs_thousand_m3', value: 'beaucoup' }] }),
  ),
)

const estimateWithMissingConstant = toEstimator(
  createTemporaryCsvDataSource(
    toFixtures({ constants: [{ name: 'national_logs_thousand_m3', value: '1000' }] }),
  ),
)

describe('estimate, produits_bois', () => {
  it.each([
    ['la région 84 : 40 % des grumes et 20 % du bois d’industrie', request('region', '84'), '352'],
    ['la région 11 : 60 % des grumes et 80 % du bois d’industrie', request('region', '11'), '968'],
    ['le département 01', request('departement', '01'), '88'],
    ['le département 69', request('departement', '69'), '264'],
    ['le département 75', request('departement', '75'), '968'],
    ['la région 84 à +100 %', request('region', '84', '1'), '2933.33'],
    ['la région 84 à -12 %', request('region', '84', '-0.12'), '-352'],
    ['la région 84 à 0 %', request('region', '84', '0'), '0'],
  ])('stocke pour %s : %s tCO2e par an', (_label, input, expected) => {
    expect(estimate(input)._unsafeUnwrap().reduction.toFixed()).toBe(expected)
  })

  it('les deux régions retrouvent le national : 352 + 968 = 11 000 × 12 % = 1 320 tCO2e', () => {
    const regionsStorage = ['84', '11'].map(
      (code) => estimate(request('region', code))._unsafeUnwrap().reduction,
    )
    expect(sum(regionsStorage).toFixed()).toBe('1320')
  })

  it('refuse une région absente des données', () => {
    expect(estimate(request('region', '99'))._unsafeUnwrapErr()).toEqual({
      kind: 'missing_data',
      dataset: 'produits-bois/regions',
      key: '99',
    })
  })

  it('refuse un département absent des données', () => {
    expect(estimate(request('departement', '99'))._unsafeUnwrapErr()).toEqual({
      kind: 'missing_data',
      dataset: 'produits-bois/departements',
      key: '99',
    })
  })

  it('refuse une récolte qui n’est pas un nombre', () => {
    expect(estimateWithBrokenTerritory(request('region', '84'))._unsafeUnwrapErr()).toEqual({
      kind: 'invalid_dataset',
      dataset: 'produits-bois/regions',
      reason: 'unreadable',
      detail: 'logs_thousand_m3=beaucoup is not a decimal number',
    })
  })

  it('refuse une constante nationale qui n’est pas un nombre', () => {
    expect(estimateWithBrokenConstant(request('region', '84'))._unsafeUnwrapErr()).toEqual({
      kind: 'invalid_dataset',
      dataset: 'produits-bois/constants',
      reason: 'unreadable',
      detail: 'national_logs_thousand_m3=beaucoup is not a decimal number',
    })
  })

  it('refuse une constante nationale absente', () => {
    expect(estimateWithMissingConstant(request('region', '84'))._unsafeUnwrapErr()).toEqual({
      kind: 'missing_data',
      dataset: 'produits-bois/constants',
      key: 'national_industrial_wood_thousand_m3',
    })
  })
})
