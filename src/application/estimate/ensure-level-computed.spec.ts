import { describe, expect, expectTypeOf, it } from 'vitest'
import { ensureLevelComputed } from './ensure-level-computed.ts'

describe('ensureLevelComputed', () => {
  it.each(['region', 'departement', 'epci'] as const)(
    'accepte reseaux_chaleur au niveau %s et rend ce niveau',
    (level) => {
      expect(ensureLevelComputed({ lever: 'reseaux_chaleur', level })._unsafeUnwrap()).toBe(level)
    },
  )

  it('accepte un niveau avec contournement : fertilisation azotée au département', () => {
    expect(
      ensureLevelComputed({ lever: 'fertilisation_azotee', level: 'departement' })._unsafeUnwrap(),
    ).toBe('departement')
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

  it('le niveau rendu exclut les niveaux non calculés du levier', () => {
    const computed = ensureLevelComputed({ lever: 'fertilisation_azotee', level: 'region' })
    expectTypeOf(computed._unsafeUnwrap()).toEqualTypeOf<'region' | 'departement'>()
  })
})
