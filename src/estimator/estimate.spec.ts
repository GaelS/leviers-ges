import type { Result } from 'neverthrow'
import { describe, expect, expectTypeOf, it } from 'vitest'
import type { EstimationError } from '../application/estimate/estimation-error.ts'
import type { TonnesCo2ePerYear } from '../domain/units.ts'
import { dataSourceFromDatasets } from '../testing/data-source-from-datasets.ts'
import { createEstimator, type Estimate, type RequestInput } from './estimate.ts'

type HaiesRequestInput = Extract<RequestInput, { id: 'haies' }>

const estimate = createEstimator(dataSourceFromDatasets({}))

function haiesRequest(hedgeKmCreatedPerYear: string | number): HaiesRequestInput {
  return {
    id: 'haies',
    parameters: { hedgeKmCreatedPerYear },
  }
}

describe('estimate', () => {
  describe('haies', () => {
    it.each([
      ['1', '1.17'],
      [1, '1.17'],
      ['0', '0'],
      ['-2', '-2.34'],
      ['0.005', '0.01'],
      ['1000000', '1170000'],
      [1e21, '1170000000000000000000'],
      [5e-7, '0'],
    ])('%j km créés par an donnent %s tCO2e par an', (kilometres, expected) => {
      const estimation = estimate(haiesRequest(kilometres))._unsafeUnwrap()
      expect(estimation.reduction.toFixed()).toBe(expected)
    })

    it('n’annonce aucune hypothèse appliquée', () => {
      expect(estimate(haiesRequest('1'))._unsafeUnwrap().appliedAssumptions).toEqual({})
    })

    it('refuse un territoire, que son résultat n’utilise pas', () => {
      const result = estimate({
        id: 'haies',
        territory: { level: 'region', code: '53' },
        parameters: { hedgeKmCreatedPerYear: '1' },
      } as unknown as RequestInput)
      expect(result._unsafeUnwrapErr()).toEqual({
        kind: 'invalid_request',
        issues: [{ parameter: 'territory', message: 'Unrecognized key: "territory"' }],
      })
    })
  })

  describe('reseaux_chaleur', () => {
    it('aiguille la requête vers son levier avec la source de données', () => {
      const withNetworks = createEstimator(
        dataSourceFromDatasets({
          'territoires/communes': [
            { code_commune: '01001', code_epci: '', code_departement: '01', code_region: '84' },
          ],
          'reseaux-chaleur/networks': [
            {
              network_id: 'A',
              commune_code: '01001',
              delivered_mwh: '100',
              emission_factor_kg_per_kwh: '0.1',
              emission_factor_source: 'fcu',
            },
          ],
        }),
      )
      const result = withNetworks({
        id: 'reseaux_chaleur',
        territory: { level: 'region', code: '84' },
        parameters: { emissionFactorReductionFraction: '0.5' },
      })
      expect(result._unsafeUnwrap().reduction.toFixed()).toBe('5')
    })
  })

  describe('entrée invalide', () => {
    it('refuse un levier inconnu', () => {
      const result = estimate({ id: 'inconnu' } as unknown as RequestInput)
      expect(result._unsafeUnwrapErr()).toEqual({
        kind: 'invalid_request',
        issues: [{ parameter: 'id', message: 'unknown lever' }],
      })
    })

    it.each(['abc', '1e3', '0x10', 'NaN', ''])(
      'refuse le texte %j comme nombre de kilomètres',
      (kilometres) => {
        expect(estimate(haiesRequest(kilometres))._unsafeUnwrapErr()).toEqual({
          kind: 'invalid_request',
          issues: [
            { parameter: 'parameters.hedgeKmCreatedPerYear', message: 'must be a decimal number' },
          ],
        })
      },
    )

    it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
      'refuse le nombre non fini %s',
      (kilometres) => {
        expect(estimate(haiesRequest(kilometres))._unsafeUnwrapErr()).toMatchObject({
          kind: 'invalid_request',
          issues: [{ parameter: 'parameters.hedgeKmCreatedPerYear' }],
        })
      },
    )

    it('refuse un paramètre qui n’appartient pas au levier', () => {
      const result = estimate({
        id: 'haies',
        parameters: { hedgeKmCreatedPerYear: '1', railShift: '0.1' },
      } as unknown as RequestInput)
      expect(result._unsafeUnwrapErr()).toMatchObject({
        kind: 'invalid_request',
        issues: [{ parameter: 'parameters.railShift' }],
      })
    })

    it.each([null, undefined, [], 'haies', 3])('refuse l’entrée %j qui n’est pas un objet', (input) => {
      const result = estimate(input as unknown as RequestInput)
      expect(result._unsafeUnwrapErr()).toEqual({
        kind: 'invalid_request',
        issues: [{ parameter: 'request', message: 'expected an object' }],
      })
    })
  })

  describe('types', () => {
    it('la réduction est en tonnes de CO2e par an, typée par levier', () => {
      const result = estimate(haiesRequest('1'))
      expectTypeOf(result).toEqualTypeOf<Result<Estimate<'haies'>, EstimationError>>()
      expectTypeOf<Estimate<'haies'>['reduction']>().toEqualTypeOf<TonnesCo2ePerYear>()
    })

    it('les paramètres d’un autre levier ne compilent pas pour haies', () => {
      expectTypeOf<{
        id: 'haies'
        parameters: { railShift: string }
      }>().not.toExtend<RequestInput>()
    })

    it('un levier absent de l’union ne compile pas', () => {
      expectTypeOf<{
        id: 'levier_inexistant'
        territory: { level: 'region'; code: string }
        parameters: { hedgeKmCreatedPerYear: string }
      }>().not.toExtend<RequestInput>()
    })
  })
})
