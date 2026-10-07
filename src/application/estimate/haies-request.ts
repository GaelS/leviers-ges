import { z } from 'zod'
import { kilometresSchema, territorySchema } from './shared-schemas.js'

const haiesRequestSchema = z.strictObject({
  id: z.literal('haies'),
  territory: territorySchema,
  parameters: z.strictObject({ hedgeKmCreatedPerYear: kilometresSchema }),
})

export { haiesRequestSchema }
