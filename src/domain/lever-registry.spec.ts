import { describe, expect, expectTypeOf, it } from 'vitest'
import { getStatus, isComputed, LEVERS, type ComputedLevels, type Status } from './lever-registry.ts'
import type { Level } from './territory.ts'

const levers = Object.entries(LEVERS)
const statuses = levers.flatMap(([, byLevel]) => Object.values<Status>(byLevel))

function countOf(status: Status): number {
  return statuses.filter((candidate) => candidate === status).length
}

describe('lever-registry', () => {
  it('compte 21 leviers et 63 statuts', () => {
    expect(levers).toHaveLength(21)
    expect(statuses).toHaveLength(63)
  })

  it('chaque levier a un statut aux trois niveaux', () => {
    const expectedLevels: Level[] = ['departement', 'epci', 'region']
    levers.forEach(([, byLevel]) => {
      expect(Object.keys(byLevel).sort()).toEqual(expectedLevels)
    })
  })

  it('compte 16 no_open_question, 24 workaround et 23 not_computed', () => {
    expect({
      noOpenQuestion: countOf('no_open_question'),
      workaround: countOf('workaround'),
      notComputed: countOf('not_computed'),
    }).toEqual({ noOpenQuestion: 16, workaround: 24, notComputed: 23 })
  })

  it('compte 17 leviers calculables sur au moins un niveau', () => {
    const computable = levers.filter(([, byLevel]) => Object.values<Status>(byLevel).some(isComputed))
    expect(computable).toHaveLength(17)
  })

  it('les quatre leviers exclus sont ceux dont les trois niveaux sont not_computed', () => {
    const excluded = levers
      .filter(([, byLevel]) => !Object.values<Status>(byLevel).some(isComputed))
      .map(([lever]) => lever)
      .sort()
    expect(excluded).toEqual([
      'occupation_des_sols',
      'pratiques_stockantes',
      'residentiel_changement_systeme_chauffage',
      'residentiel_renovation',
    ])
  })

  it('donne le statut d’un levier à un niveau', () => {
    expect(getStatus({ lever: 'fertilisation_azotee', level: 'epci' })).toBe('not_computed')
    expect(getStatus({ lever: 'haies', level: 'epci' })).toBe('no_open_question')
    expect(getStatus({ lever: 'transport_marchandises_efficacite', level: 'region' })).toBe('workaround')
  })

  it('les niveaux calculés sont typés par levier', () => {
    expectTypeOf<ComputedLevels<'haies'>>().toEqualTypeOf<Level>()
    expectTypeOf<ComputedLevels<'fertilisation_azotee'>>().toEqualTypeOf<'region' | 'departement'>()
    expectTypeOf<ComputedLevels<'transport_marchandises_report_modal'>>().toEqualTypeOf<'region'>()
    expectTypeOf<ComputedLevels<'pratiques_stockantes'>>().toEqualTypeOf<never>()
  })
})
