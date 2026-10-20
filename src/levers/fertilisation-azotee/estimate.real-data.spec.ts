import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createEstimationContext } from '../../application/estimate/create-estimation-context.ts'
import type { ComputedLevels } from '../../domain/lever-registry.ts'
import { createCsvDataSource } from '../../infrastructure/csv/csv-data-source.ts'
import { estimate } from './estimate.ts'
import {
  fertilisationAzoteeRequestSchema,
  type FertilisationAzoteeRequest,
} from './fertilisation-azotee-request.ts'

type Level = ComputedLevels<'fertilisation_azotee'>

const context = createEstimationContext(
  createCsvDataSource(join(import.meta.dirname, '..', '..', '..', 'data')),
)

function toRequest({ level, code }: { level: Level; code: string }): FertilisationAzoteeRequest {
  const parsed = fertilisationAzoteeRequestSchema.parse({
    id: 'fertilisation_azotee',
    territory: { level, code },
    parameters: { nitrogenReductionFraction: '0.1' },
  })
  return { ...parsed, territory: { ...parsed.territory, level } }
}

function estimation(target: { level: Level; code: string }) {
  return estimate(toRequest(target), context)
}

describe('estimate fertilisation_azotee, UNIFA et France Fertilisants', () => {
  it.each([
    ['region', '84', '44008.8'],
    ['region', '53', '76221.09'],
    ['region', '11', '34740.83'],
    ['region', '94', '100.61'],
    ['departement', '28', '33489.89'],
    ['departement', '75', '9984.02'],
    ['departement', '35', '18671.23'],
  ] as const)(
    'à 10 %% de réduction, le niveau %s %s évite %s tCO2e',
    (level, code, expected) => {
      expect(estimation({ level, code })._unsafeUnwrap().reduction.toFixed()).toBe(expected)
    },
  )

  it.each([
    ['departement', '2A'],
    ['departement', '2B'],
  ] as const)('refuse le département %s, la Corse n’est pas publiée par département', (level, code) => {
    expect(estimation({ level, code })._unsafeUnwrapErr()).toMatchObject({
      kind: 'missing_data',
      dataset: 'fertilisation-azotee/departements',
    })
  })
})
