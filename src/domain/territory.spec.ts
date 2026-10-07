import { describe, expect, it } from 'vitest'
import { levels, parseTerritoryCode } from './territory.js'

describe('territory', () => {
  it('compte trois niveaux', () => {
    expect([...levels]).toEqual(['departement', 'epci', 'region'])
  })

  it.each(['11', '2A', '200054781'])('accepte le code %s', (code) => {
    expect(parseTerritoryCode(code)._unsafeUnwrap()).toBe(code)
  })

  it.each(['', '  '])('refuse le code vide %j', (code) => {
    expect(parseTerritoryCode(code)._unsafeUnwrapErr()).toEqual({
      kind: 'invalid_parameter',
      parameter: 'territoryCode',
      value: code,
    })
  })
})
