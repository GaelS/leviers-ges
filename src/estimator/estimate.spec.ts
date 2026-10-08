import type { Result } from 'neverthrow'
import { describe, expect, expectTypeOf, it } from 'vitest'
import type { z } from 'zod'
import type { EstimationError } from '../application/estimate/estimation-error.ts'
import type { TonnesCo2ePerYear } from '../domain/units.ts'
import { dataSourceFromDatasets } from '../testing/data-source-from-datasets.ts'
import { createEstimator, type Estimate, type RequestInput } from './estimate.ts'
import type { requestSchema } from './parse-request.ts'

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

    it('admet des kilomètres négatifs : un arrachage net donne une réduction négative', () => {
      const estimation = estimate(haiesRequest('-10'))._unsafeUnwrap()
      expect(estimation.reduction.toFixed()).toBe('-11.7')
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

    function reseauxChaleurRequest({
      code = '84',
      fraction = '0.5',
    }: {
      code?: string
      fraction?: string | number
    }): RequestInput {
      return {
        id: 'reseaux_chaleur',
        territory: { level: 'region', code },
        parameters: { emissionFactorReductionFraction: fraction },
      }
    }

    it('aiguille la requête vers son levier avec la source de données', () => {
      const result = withNetworks(reseauxChaleurRequest({}))
      expect(result._unsafeUnwrap().reduction.toFixed()).toBe('5')
    })

    it('accepte une fraction en nombre', () => {
      const result = withNetworks(reseauxChaleurRequest({ fraction: 0.5 }))
      expect(result._unsafeUnwrap().reduction.toFixed()).toBe('5')
    })

    it('accepte un code de territoire entouré d’espaces', () => {
      const result = withNetworks(reseauxChaleurRequest({ code: ' 84 ', fraction: '1' }))
      expect(result._unsafeUnwrap().reduction.toFixed()).toBe('10')
    })

    it.each(['-0.1', '1.01', '100'])('refuse la fraction %s hors de 0 à 1', (fraction) => {
      expect(estimate(reseauxChaleurRequest({ fraction }))._unsafeUnwrapErr()).toEqual({
        kind: 'invalid_request',
        issues: [
          {
            parameter: 'parameters.emissionFactorReductionFraction',
            message: 'must be between 0 and 1',
          },
        ],
      })
    })

    it.each([null, 'abc'])('refuse la fraction %j qui n’est pas un nombre', (fraction) => {
      const request = reseauxChaleurRequest({ fraction: fraction as unknown as string })
      expect(estimate(request)._unsafeUnwrapErr()).toMatchObject({
        kind: 'invalid_request',
        issues: [{ parameter: 'parameters.emissionFactorReductionFraction' }],
      })
    })

    it('refuse un niveau de territoire inconnu et un code vide', () => {
      const request = {
        ...reseauxChaleurRequest({}),
        territory: { level: 'commune', code: '' },
      } as unknown as RequestInput
      expect(estimate(request)._unsafeUnwrapErr()).toEqual({
        kind: 'invalid_request',
        issues: [
          { parameter: 'territory.level', message: expect.stringContaining('Invalid') as string },
          { parameter: 'territory.code', message: 'must not be empty' },
        ],
      })
    })

    it('refuse un code de territoire fait seulement d’espaces', () => {
      expect(estimate(reseauxChaleurRequest({ code: '  ' }))._unsafeUnwrapErr()).toEqual({
        kind: 'invalid_request',
        issues: [{ parameter: 'territory.code', message: 'must not be empty' }],
      })
    })
  })

  describe('batiments_machines_agricoles', () => {
    const withEnergy = createEstimator(
      dataSourceFromDatasets({
        'territoires/communes': [
          { code_commune: '01001', code_epci: '', code_departement: '01', code_region: '84' },
        ],
        'batiments-machines-agricoles/regions': [
          {
            code_region: '84',
            electricity_gwh: '0',
            natural_gas_gwh: '0',
            petroleum_products_gwh: '1',
            heat_gwh: '0',
          },
        ],
        'surface-agricole-utile/communes': [{ code_commune: '01001', agricultural_area_ha: '10' }],
        'reseaux-chaleur/networks': [],
      }),
    )

    it('aiguille la requête vers son levier avec le contexte d’estimation', () => {
      const result = withEnergy({
        id: 'batiments_machines_agricoles',
        territory: { level: 'region', code: '84' },
        parameters: {
          electricityReductionFraction: '0',
          naturalGasReductionFraction: '0',
          petroleumProductsReductionFraction: '1',
          heatReductionFraction: '0',
        },
      })
      expect(result._unsafeUnwrap().reduction.toFixed()).toBe('280.8')
    })

    function batimentsMachinesAgricolesRequest(parameters: object): RequestInput {
      return {
        id: 'batiments_machines_agricoles',
        territory: { level: 'region', code: '84' },
        parameters: {
          electricityReductionFraction: '1',
          naturalGasReductionFraction: '1',
          petroleumProductsReductionFraction: '1',
          heatReductionFraction: '1',
          ...parameters,
        },
      }
    }

    it('accepte une fraction en nombre', () => {
      const request = batimentsMachinesAgricolesRequest({
        electricityReductionFraction: '0',
        naturalGasReductionFraction: '0',
        petroleumProductsReductionFraction: 0.5,
        heatReductionFraction: '0',
      })
      expect(withEnergy(request)._unsafeUnwrap().reduction.toFixed()).toBe('140.4')
    })

    it.each([
      ['electricityReductionFraction'],
      ['naturalGasReductionFraction'],
      ['petroleumProductsReductionFraction'],
      ['heatReductionFraction'],
    ] as const)('refuse %s hors de 0 à 1', (parameter) => {
      const request = batimentsMachinesAgricolesRequest({ [parameter]: '1.01' })
      expect(estimate(request)._unsafeUnwrapErr()).toEqual({
        kind: 'invalid_request',
        issues: [{ parameter: `parameters.${parameter}`, message: 'must be between 0 and 1' }],
      })
    })

    it('refuse une requête à laquelle il manque un vecteur', () => {
      const request = batimentsMachinesAgricolesRequest({ heatReductionFraction: undefined })
      expect(estimate(request)._unsafeUnwrapErr()).toMatchObject({
        kind: 'invalid_request',
        issues: [{ parameter: 'parameters.heatReductionFraction' }],
      })
    })

    it('refuse un paramètre inconnu', () => {
      const request = batimentsMachinesAgricolesRequest({ wood: '1' })
      expect(estimate(request)._unsafeUnwrapErr()).toMatchObject({
        kind: 'invalid_request',
        issues: [{ parameter: 'parameters.wood' }],
      })
    })
  })

  describe('entrée invalide', () => {
    it.each([{ id: 'inconnu' }, { id: 3 }, {}])('refuse l’entrée %j sans levier connu', (input) => {
      const result = estimate(input as unknown as RequestInput)
      expect(result._unsafeUnwrapErr()).toEqual({
        kind: 'invalid_request',
        issues: [{ parameter: 'id', message: 'unknown lever' }],
      })
    })

    it('rapporte toutes les erreurs de la requête, dans l’ordre des champs', () => {
      const request = {
        id: 'reseaux_chaleur',
        territory: { level: 'region', code: '' },
        parameters: { emissionFactorReductionFraction: '2', wood: '1' },
      } as unknown as RequestInput
      expect(estimate(request)._unsafeUnwrapErr()).toEqual({
        kind: 'invalid_request',
        issues: [
          { parameter: 'territory.code', message: 'must not be empty' },
          { parameter: 'parameters.emissionFactorReductionFraction', message: 'must be between 0 and 1' },
          { parameter: 'parameters.wood', message: expect.stringContaining('Unrecognized') as string },
        ],
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

    it('l’union écrite des entrées est celle des schémas de requête', () => {
      expectTypeOf<z.input<typeof requestSchema>>().toEqualTypeOf<RequestInput>()
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
