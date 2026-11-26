import { describe, expect, it } from 'vitest'
import { getStatus, LEVERS } from '../domain/lever-registry.ts'
import { levels } from '../domain/territory.ts'
import { LEVERS_CATALOG, type LeverCatalogEntry } from './levers-catalog.ts'

const entryOf = (id: string): LeverCatalogEntry => {
  const entry = LEVERS_CATALOG.find((candidate) => candidate.id === id)
  if (entry === undefined) throw new Error(`levier absent du catalogue : ${id}`)
  return entry
}

describe('LEVERS_CATALOG', () => {
  it('liste les 21 leviers du registre, chacun une fois', () => {
    expect(LEVERS_CATALOG.map(({ id }) => id).toSorted()).toEqual(Object.keys(LEVERS).toSorted())
    expect(LEVERS_CATALOG).toHaveLength(21)
  })

  it('reprend le statut de chaque niveau dans le registre', () => {
    for (const entry of LEVERS_CATALOG)
      for (const level of levels)
        expect(entry.levels[level]).toBe(getStatus({ lever: entry.id, level }))
  })

  it('ne demande pas de territoire pour haies et pratiques_stockantes, et pour eux seuls', () => {
    const withoutTerritory = LEVERS_CATALOG.filter(({ territoryRequired }) => !territoryRequired)
    expect(withoutTerritory.map(({ id }) => id).toSorted()).toEqual(['haies', 'pratiques_stockantes'])
  })

  it('décrit les paramètres de haies en JSON Schema, la chaîne décimale avec son motif', () => {
    expect(entryOf('haies').parametersJsonSchema).toMatchObject({
      type: 'object',
      required: ['hedgeKmCreatedPerYear'],
      additionalProperties: false,
      properties: {
        hedgeKmCreatedPerYear: {
          anyOf: [{ type: 'string', pattern: '^-?\\d+(\\.\\d+)?$' }, { type: 'number' }],
        },
      },
    })
  })

  it('décrit les bornes d’une fraction et d’une réduction dans la description du paramètre', () => {
    expect(entryOf('batiments_machines_agricoles').parametersJsonSchema).toMatchObject({
      properties: {
        naturalGasReductionFraction: { description: 'Fraction décimale de 0 à 1, en texte ou en nombre' },
        electricityReductionFraction: {
          description: 'Réduction décimale au plus égale à 1 ; une valeur négative est une hausse',
        },
      },
    })
  })

  it('marque les paramètres facultatifs hors de required', () => {
    expect(entryOf('transport_marchandises_report_modal').parametersJsonSchema).toMatchObject({
      required: ['roadToRailFraction', 'roadToWaterwayFraction'],
    })
  })

  it('refuse tout paramètre inconnu pour chaque levier, comme l’estimateur', () => {
    for (const { id, parametersJsonSchema } of LEVERS_CATALOG)
      expect(parametersJsonSchema['additionalProperties'], id).toBe(false)
  })
})
