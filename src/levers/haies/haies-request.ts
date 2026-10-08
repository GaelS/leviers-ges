import { z } from 'zod'
import { kilometresSchema, territorySchema } from '../../application/estimate/shared-schemas.ts'

const haiesRequestSchema = z.strictObject({
  id: z.literal('haies'),
  territory: territorySchema,
  parameters: z.strictObject({ hedgeKmCreatedPerYear: kilometresSchema }),
})

type HaiesRequestInput = z.input<typeof haiesRequestSchema>

export { haiesRequestSchema }
export type { HaiesRequestInput }
