import { describe, expect, it } from 'vitest'
import { ISSUE_CODES, type EstimationError } from './estimation-error.ts'
import { describeEstimationError } from './describe-estimation-error.ts'

describe('describeEstimationError', () => {
  it.each<[string, EstimationError, string]>([
    [
      'level_not_computed',
      { kind: 'level_not_computed', lever: 'transport_marchandises_report_modal', level: 'departement' },
      'Le levier transport_marchandises_report_modal n’est pas calculé au niveau département.',
    ],
    [
      'unknown_territory',
      { kind: 'unknown_territory', level: 'epci', code: '000000000' },
      'Territoire inconnu : EPCI « 000000000 ».',
    ],
    [
      'missing_data',
      { kind: 'missing_data', dataset: 'transport-marchandises/regions', key: '99' },
      'Aucune donnée pour « 99 » dans le jeu transport-marchandises/regions.',
    ],
    [
      'invalid_dataset',
      {
        kind: 'invalid_dataset',
        dataset: 'transport-marchandises/regions',
        reason: 'checksum_mismatch',
        detail: 'expected a, got b',
      },
      'Jeu de données transport-marchandises/regions invalide : checksum_mismatch (expected a, got b).',
    ],
  ])('décrit %s en une phrase française', (_kind, error, expected) => {
    expect(describeEstimationError(error)).toBe(expected)
  })

  it('décrit chaque région, département et EPCI avec son nom', () => {
    expect(describeEstimationError({ kind: 'unknown_territory', level: 'region', code: '99' })).toBe(
      'Territoire inconnu : région « 99 ».',
    )
    expect(describeEstimationError({ kind: 'unknown_territory', level: 'departement', code: '99' })).toBe(
      'Territoire inconnu : département « 99 ».',
    )
  })

  it('décrit une requête invalide par paramètre, avec le texte du code et non le message', () => {
    const description = describeEstimationError({
      kind: 'invalid_request',
      issues: [
        { parameter: 'parameters.hedgeKmCreatedPerYear', code: 'required', message: 'Invalid input' },
        { parameter: 'parameters.x', code: 'unknown_parameter', message: 'Unrecognized key: "x"' },
      ],
    })
    expect(description).toBe(
      'Requête invalide : parameters.hedgeKmCreatedPerYear : valeur obligatoire manquante ; parameters.x : paramètre inconnu.',
    )
  })

  it.each(ISSUE_CODES)('a un texte pour le code %s', (code) => {
    const description = describeEstimationError({
      kind: 'invalid_request',
      issues: [{ parameter: 'p', code, message: 'm' }],
    })
    expect(description).toMatch(/^Requête invalide : p : .+\.$/)
    expect(description).not.toContain(code)
  })

  it('décrit une requête invalide sans issue', () => {
    expect(describeEstimationError({ kind: 'invalid_request', issues: [] })).toBe('Requête invalide.')
  })
})
