import { z } from 'zod'
import { fractionSchema, territorySchema } from '../../application/estimate/shared-schemas.ts'

const reseauxChaleurRequestSchema = z.strictObject({
  id: z.literal('reseaux_chaleur'),
  territory: territorySchema,
  parameters: z.strictObject({ emissionFactorReductionFraction: fractionSchema }),
})

type ReseauxChaleurRequestInput = z.input<typeof reseauxChaleurRequestSchema>

export { reseauxChaleurRequestSchema }
export type { ReseauxChaleurRequestInput }
