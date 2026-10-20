import type { Result } from 'neverthrow'
import { describe, expect, it } from 'vitest'
import { createEstimationContext } from '../../application/estimate/create-estimation-context.ts'
import type { EstimateResult } from '../../application/estimate/estimate-result.ts'
import type { DataSource, DataSourceError } from '../../domain/data-source.ts'
import type { ComputedLevels } from '../../domain/lever-registry.ts'
import {
  createTemporaryCsvDataSource,
  type DatasetFixture,
} from '../../testing/temporary-csv-data-source.ts'
import { estimate as estimateFertilisationAzotee } from './estimate.ts'
import {
  fertilisationAzoteeRequestSchema,
  type FertilisationAzoteeRequest,
} from './fertilisation-azotee-request.ts'

const FIXTURES: Readonly<Record<string, DatasetFixture>> = {
  'fertilisation-azotee/regions': {
    keyColumn: 'code_region',
    level: 'region',
    rows: [
      {
        code_region: '84',
        nitrogen_delivered_tonnes_2021_2022: '1000',
        nitrogen_delivered_tonnes_2022_2023: '3000',
      },
    ],
  },
  'fertilisation-azotee/departements': {
    keyColumn: 'code_departement',
    level: 'departement',
    rows: [{ code_departement: '01', nitrogen_delivered_tonnes_2021_2022: '500' }],
  },
}

type Estimator = (request: FertilisationAzoteeRequest) => Result<EstimateResult, DataSourceError>

function toEstimator(dataSource: DataSource): Estimator {
  const context = createEstimationContext(dataSource)
  return (request) => estimateFertilisationAzotee(request, context)
}

function request(
  level: ComputedLevels<'fertilisation_azotee'>,
  code: string,
  nitrogenReductionFraction = '0.1',
): FertilisationAzoteeRequest {
  const parsed = fertilisationAzoteeRequestSchema.parse({
    id: 'fertilisation_azotee',
    territory: { level, code },
    parameters: { nitrogenReductionFraction },
  })
  return { ...parsed, territory: { ...parsed.territory, level } }
}

const estimate = toEstimator(createTemporaryCsvDataSource(FIXTURES))

describe('estimate, fertilisation_azotee', () => {
  it('évite pour la région 84 : 10 % de la moyenne de 1 000 et 3 000 t, soit 2 000 t, évitent 1 146,6 tCO2e', () => {
    expect(estimate(request('region', '84'))._unsafeUnwrap().reduction.toFixed()).toBe('1146.6')
  })

  it('évite pour le département 01 : 10 % de 500 t évitent 286,65 tCO2e', () => {
    expect(estimate(request('departement', '01'))._unsafeUnwrap().reduction.toFixed()).toBe('286.65')
  })

  it('renvoie la moyenne de deux campagnes pour une région, une campagne pour un département', () => {
    const campaigns = (level: ComputedLevels<'fertilisation_azotee'>, code: string) =>
      estimate(request(level, code))._unsafeUnwrap().appliedAssumptions['nitrogenCampaigns']?.value
    expect({
      region: campaigns('region', '84'),
      departement: campaigns('departement', '01'),
    }).toEqual({
      region: 'average of the 2021-2022 and 2022-2023 campaigns',
      departement: '2021-2022 campaign only',
    })
  })

  it('renvoie le facteur d’émission et sa limite', () => {
    const factor = estimate(request('region', '84'))._unsafeUnwrap().appliedAssumptions[
      'nitrogenSpreadingEmissionFactor'
    ]
    expect(factor?.value).toBe('5.733')
    expect(factor?.limit).toContain('400%')
  })

  it.each([
    ['une région absente du jeu', request('region', '99'), 'fertilisation-azotee/regions'],
    ['un département absent du jeu', request('departement', '2A'), 'fertilisation-azotee/departements'],
  ])('refuse %s', (_label, input, dataset) => {
    expect(estimate(input)._unsafeUnwrapErr()).toEqual({
      kind: 'missing_data',
      dataset,
      key: input.territory.code,
    })
  })

  it.each([
    ['region', 'code_region', 'fertilisation-azotee/regions', '84'],
    ['departement', 'code_departement', 'fertilisation-azotee/departements', '01'],
  ] as const)('refuse des tonnes qui ne sont pas un nombre pour un niveau %s', (level, key, dataset, code) => {
    const broken = toEstimator(
      createTemporaryCsvDataSource({
        ...FIXTURES,
        [dataset]: {
          keyColumn: key,
          level,
          rows: [
            {
              [key]: code,
              nitrogen_delivered_tonnes_2021_2022: 'beaucoup',
              nitrogen_delivered_tonnes_2022_2023: '1',
            },
          ],
        },
      }),
    )
    expect(broken(request(level, code))._unsafeUnwrapErr()).toMatchObject({
      kind: 'invalid_dataset',
      reason: 'unreadable',
    })
  })
})
