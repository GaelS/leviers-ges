import { z } from 'zod'
import { getStatus, type LeverId, type Status } from '../domain/lever-registry.ts'
import type { Level } from '../domain/territory.ts'
import { requestSchema } from './parse-request.ts'

type JsonSchema = Readonly<Record<string, unknown>>

type LeverCatalogEntry = {
  readonly id: LeverId
  readonly territoryRequired: boolean
  readonly levels: Readonly<Record<Level, Status>>
  readonly parametersJsonSchema: JsonSchema
}

function toLevelStatuses(lever: LeverId): Readonly<Record<Level, Status>> {
  return {
    region: getStatus({ lever, level: 'region' }),
    departement: getStatus({ lever, level: 'departement' }),
    epci: getStatus({ lever, level: 'epci' }),
  }
}

// Source : choix de conception, non validé : catalogue des leviers dérivé du registre et des schémas de requête, pour documenter l'API d'un consommateur sans copie à tenir à jour ; les schémas décrivent l'entrée (io: input), sans les bornes que le calcul contrôle
const LEVERS_CATALOG: readonly LeverCatalogEntry[] = requestSchema.options.map((schema) => ({
  id: schema.shape.id.value,
  territoryRequired: 'territory' in schema.shape,
  levels: toLevelStatuses(schema.shape.id.value),
  parametersJsonSchema: z.toJSONSchema(schema.shape.parameters, {
    io: 'input',
    unrepresentable: 'any',
  }),
}))

export { LEVERS_CATALOG }
export type { JsonSchema, LeverCatalogEntry }
