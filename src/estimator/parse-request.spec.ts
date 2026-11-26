import { describe, expect, expectTypeOf, it } from 'vitest'
import {
  ISSUE_CODES,
  type InvalidRequest,
  type InvalidRequestIssueCode,
} from '../application/estimate/estimation-error.ts'
import { parseRequest } from './parse-request.ts'

const haies = (hedgeKmCreatedPerYear: unknown) => ({
  id: 'haies',
  parameters: { hedgeKmCreatedPerYear },
})

const batiments = (parameters: object) => ({
  id: 'batiments_machines_agricoles',
  territory: { level: 'region', code: '84' },
  parameters: {
    electricityReductionFraction: '0',
    naturalGasReductionFraction: '0',
    petroleumProductsReductionFraction: '0',
    heatReductionFraction: '0',
    ...parameters,
  },
})

function codesOf(input: unknown): readonly string[] {
  return parseRequest(input).match(
    () => [],
    ({ issues }) => issues.map(({ code }) => code),
  )
}

describe('code stable de chaque issue de requête invalide', () => {
  it.each([
    ['une requête qui n’est pas un objet', 'pas un objet', ['not_an_object']],
    ['un levier inconnu', { id: 'inconnu' }, ['unknown_lever']],
    ['un paramètre inconnu', { ...haies('1'), parameters: { hedgeKmCreatedPerYear: '1', x: 1 } }, ['unknown_parameter']],
    ['un paramètre absent', haies(undefined), ['required']],
    ['un paramètre nul', haies(null), ['invalid_type']],
    ['un texte qui n’est pas décimal', haies('abc'), ['not_a_decimal']],
    ['une fraction au-dessus de 1', batiments({ naturalGasReductionFraction: '1.5' }), ['out_of_range']],
    ['une réduction d’électricité au-dessus de 1', batiments({ electricityReductionFraction: '1.5' }), ['out_of_range']],
    ['une surface négative', { id: 'pratiques_stockantes', parameters: { intermediateCropsHectares: '-1', permanentVineyardGrassingHectares: '0', winterIntercropVineyardHectares: '0', agroforestryHectares: '0', temporaryGrasslandExtensionHectares: '0' } }, ['out_of_range']],
    ['un territoire absent', { ...batiments({}), territory: undefined }, ['required']],
    ['un territoire qui n’est pas un objet', { ...batiments({}), territory: 5 }, ['invalid_type']],
    ['un niveau de territoire inconnu', { ...batiments({}), territory: { level: 'commune', code: '84' } }, ['invalid_value']],
    ['un code de territoire vide', { ...batiments({}), territory: { level: 'region', code: ' ' } }, ['invalid_value']],
    [
      'des parts de chauffage au-dessus de 100 %',
      {
        id: 'residentiel_changement_systeme_chauffage',
        territory: { level: 'region', code: '84' },
        parameters: { targetElectricityShareFraction: '0.8', targetNaturalGasShareFraction: '0.8' },
      },
      ['invalid_combination'],
    ],
  ])('%s donne %j', (_label, input, expected) => {
    expect(codesOf(input)).toEqual(expected)
  })

  it('ne renvoie que des codes de la liste exposée', () => {
    const error: InvalidRequest = parseRequest({ id: 'inconnu' })._unsafeUnwrapErr()
    for (const { code } of error.issues) expect(ISSUE_CODES).toContain(code)
  })

  it('a pour type la liste des codes', () => {
    expectTypeOf<(typeof ISSUE_CODES)[number]>().toEqualTypeOf<InvalidRequestIssueCode>()
  })
})
