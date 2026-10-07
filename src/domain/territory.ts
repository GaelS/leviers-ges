type Level = 'departement' | 'epci' | 'region'

type TerritoryCode = string & { readonly territoryCode: true }

type Territory<L extends Level> = {
  readonly level: L
  readonly code: TerritoryCode
}

export type { Level, Territory, TerritoryCode }
