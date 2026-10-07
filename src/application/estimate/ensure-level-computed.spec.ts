import { ok } from 'neverthrow'
import { describe, expect, it } from 'vitest'
import { ensureLevelComputed } from './ensure-level-computed.js'

describe('ensureLevelComputed', () => {
  it.each(['region', 'departement', 'epci'] as const)('accepte haies au niveau %s', (level) => {
    expect(ensureLevelComputed({ lever: 'haies', level })).toEqual(ok())
  })

  it('accepte un niveau avec contournement : fertilisation azotée au département', () => {
    expect(ensureLevelComputed({ lever: 'fertilisation_azotee', level: 'departement' })).toEqual(
      ok(),
    )
  })

  it.each([
    ['fertilisation_azotee', 'epci'],
    ['transport_marchandises_report_modal', 'departement'],
    ['pratiques_stockantes', 'region'],
  ] as const)('refuse %s au niveau %s', (lever, level) => {
    expect(ensureLevelComputed({ lever, level })._unsafeUnwrapErr()).toEqual({
      kind: 'level_not_computed',
      lever,
      level,
    })
  })
})
