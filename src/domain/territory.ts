import { err, ok, type Result } from 'neverthrow'
import { invalidParameter, type InvalidParameter } from './invalid-parameter.js'

const levels = ['departement', 'epci', 'region'] as const

type Level = (typeof levels)[number]

type TerritoryCode = string & { readonly territoryCode: true }

type Territory<L extends Level> = {
  readonly level: L
  readonly code: TerritoryCode
}

function parseTerritoryCode(value: string): Result<TerritoryCode, InvalidParameter> {
  return value.trim() === ''
    ? err(invalidParameter({ parameter: 'territoryCode', value }))
    : ok(value as TerritoryCode)
}

export { levels, parseTerritoryCode }
export type { Level, Territory, TerritoryCode }
