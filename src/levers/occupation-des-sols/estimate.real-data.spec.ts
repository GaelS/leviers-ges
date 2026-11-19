import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createEstimationContext } from '../../application/estimate/create-estimation-context.ts'
import { createCsvDataSource } from '../../infrastructure/csv/csv-data-source.ts'
import { estimate } from './estimate.ts'
import {
  occupationDesSolsRequestSchema,
  type OccupationDesSolsRequest,
} from './occupation-des-sols-request.ts'

const context = createEstimationContext(
  createCsvDataSource(join(import.meta.dirname, '..', '..', '..', 'data')),
)

function toRequest(code: string): OccupationDesSolsRequest {
  const parsed = occupationDesSolsRequestSchema.parse({
    id: 'occupation_des_sols',
    territory: { level: 'epci', code },
    parameters: {
      afforestationHectaresPerYear: '10',
      wetlandDevelopmentHectaresPerYear: '5',
      desealingHectaresPerYear: '2',
      horizonYears: '20',
    },
  })
  return { ...parsed, territory: { ...parsed.territory, level: 'epci' } }
}

describe('estimate occupation_des_sols, ALDO stocks de carbone et Flux 2', () => {
  it.each([
    ['200046977', '29489.46'],
    ['200000172', '19203.9'],
    ['243500139', '30000.44'],
    ['200054781', '41305.94'],
    ['200067049', '33157.58'],
  ])(
    'à 10 ha/an d’afforestation, 5 de zones humides, 2 de désimperméabilisation sur 20 ans, l’EPCI %s stocke %s tCO2e',
    (code, expected) => {
      expect(estimate(toRequest(code), context)._unsafeUnwrap().reduction.toFixed()).toBe(expected)
    },
  )

  it('refuse un EPCI absent du millésime ALDO', () => {
    expect(estimate(toRequest('200083392'), context)._unsafeUnwrapErr()).toMatchObject({
      kind: 'missing_data',
      dataset: 'occupation-des-sols/epcis-surfaces',
    })
  })
})
