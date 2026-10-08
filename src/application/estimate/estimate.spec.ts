import type { Result } from 'neverthrow'
import { describe, expect, expectTypeOf, it } from 'vitest'
import type { Level } from '../../domain/territory.js'
import type { TonnesCo2ePerYear } from '../../domain/units.js'
import { dataSourceFromDatasets } from '../../testing/data-source-from-datasets.js'
import { createEstimator, type Estimate } from './estimate.js'
import type { EstimationError } from './estimation-error.js'
import type { RequestInput } from './request.js'

type HaiesRequestInput = Extract<RequestInput, { id: 'haies' }>

const estimate = createEstimator(dataSourceFromDatasets({}))

function haiesRequest(hedgeKmCreatedPerYear: string | number): HaiesRequestInput {
  return {
    id: 'haies',
    territory: { level: 'region', code: '53' },
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

    it.each<Level>(['region', 'departement', 'epci'])('calcule au niveau %s', (level) => {
      const result = estimate({
        id: 'haies',
        territory: { level, code: '53' },
        parameters: { hedgeKmCreatedPerYear: '1' },
      })
      expect(result._unsafeUnwrap().reduction.toFixed()).toBe('1.17')
    })
  })

  describe('entrée invalide', () => {
    it('refuse un levier inconnu', () => {
      const result = estimate({ id: 'inconnu' } as unknown as RequestInput)
      expect(result._unsafeUnwrapErr()).toMatchObject({
        kind: 'invalid_request',
        issues: [{ parameter: 'id' }],
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
        territory: { level: 'region', code: '53' },
        parameters: { hedgeKmCreatedPerYear: '1', railShift: '0.1' },
      } as unknown as RequestInput)
      expect(result._unsafeUnwrapErr()).toMatchObject({
        kind: 'invalid_request',
        issues: [{ parameter: 'parameters.railShift' }],
      })
    })

    it('refuse une entrée qui n’est pas un objet', () => {
      const result = estimate(null as unknown as RequestInput)
      expect(result._unsafeUnwrapErr()).toMatchObject({
        kind: 'invalid_request',
        issues: [{ parameter: 'request' }],
      })
    })

    it('refuse un niveau de territoire inconnu et un code vide', () => {
      const result = estimate({
        id: 'haies',
        territory: { level: 'commune', code: '' },
        parameters: { hedgeKmCreatedPerYear: '1' },
      } as unknown as RequestInput)
      expect(result._unsafeUnwrapErr()).toEqual({
        kind: 'invalid_request',
        issues: [
          { parameter: 'territory.level', message: expect.stringContaining('Invalid') as string },
          { parameter: 'territory.code', message: 'must not be empty' },
        ],
      })
    })

    it('refuse un code de territoire fait seulement d’espaces', () => {
      const result = estimate({
        id: 'haies',
        territory: { level: 'region', code: '  ' },
        parameters: { hedgeKmCreatedPerYear: '1' },
      })
      expect(result._unsafeUnwrapErr()).toEqual({
        kind: 'invalid_request',
        issues: [{ parameter: 'territory.code', message: 'must not be empty' }],
      })
    })

    it('accepte un code de territoire entouré d’espaces', () => {
      const result = estimate({
        id: 'haies',
        territory: { level: 'region', code: ' 53 ' },
        parameters: { hedgeKmCreatedPerYear: '1' },
      })
      expect(result._unsafeUnwrap().reduction.toFixed()).toBe('1.17')
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
        territory: { level: 'region'; code: string }
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
