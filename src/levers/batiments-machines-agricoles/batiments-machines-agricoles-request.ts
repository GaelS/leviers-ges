import { z } from 'zod'
import {
  fractionSchema,
  reductionFractionSchema,
  territorySchema,
} from '../../application/estimate/shared-schemas.ts'

const batimentsMachinesAgricolesRequestSchema = z.strictObject({
  id: z.literal('batiments_machines_agricoles'),
  territory: territorySchema,
  parameters: z.strictObject({
    electricityReductionFraction: reductionFractionSchema,
    naturalGasReductionFraction: fractionSchema,
    petroleumProductsReductionFraction: fractionSchema,
    heatReductionFraction: fractionSchema,
  }),
})

type BatimentsMachinesAgricolesRequestInput = z.input<
  typeof batimentsMachinesAgricolesRequestSchema
>

type BatimentsMachinesAgricolesRequest = z.output<typeof batimentsMachinesAgricolesRequestSchema>

export { batimentsMachinesAgricolesRequestSchema }
export type { BatimentsMachinesAgricolesRequest, BatimentsMachinesAgricolesRequestInput }
