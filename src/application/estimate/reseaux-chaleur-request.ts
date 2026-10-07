import { z } from 'zod'
import { fractionSchema, territorySchema } from './shared-schemas.js'

const reseauxChaleurRequestSchema = z.strictObject({
  id: z.literal('reseaux_chaleur'),
  territory: territorySchema,
  parameters: z.strictObject({ emissionFactorReductionFraction: fractionSchema }),
})

export { reseauxChaleurRequestSchema }
