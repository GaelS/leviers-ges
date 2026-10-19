const sourceLevels = ['REG', 'DEP', 'EPCI'] as const

type SourceLevel = (typeof sourceLevels)[number]

// Source : fiche d'analyse 11, sources/personnes : l'Insee et le SDES rangent les trajets hors du champ (étranger, commune inconnue) sous le code 99 (région), 999 (département) et ZZZZZZZZZ (EPCI)
const OUT_OF_SCOPE_CODES: Readonly<Record<SourceLevel, string>> = {
  REG: '99',
  DEP: '999',
  EPCI: 'ZZZZZZZZZ',
}

function isInScope({ level, code }: { level: SourceLevel; code: string }): boolean {
  return code !== OUT_OF_SCOPE_CODES[level]
}

export { isInScope, sourceLevels }
export type { SourceLevel }
