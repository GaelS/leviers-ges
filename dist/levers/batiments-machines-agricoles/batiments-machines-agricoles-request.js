import { z } from 'zod';
import { fractionSchema, territorySchema } from "../../application/estimate/shared-schemas.js";
const batimentsMachinesAgricolesRequestSchema = z.strictObject({
    id: z.literal('batiments_machines_agricoles'),
    territory: territorySchema,
    parameters: z.strictObject({
        electricityReductionFraction: fractionSchema,
        naturalGasReductionFraction: fractionSchema,
        petroleumProductsReductionFraction: fractionSchema,
        heatReductionFraction: fractionSchema,
    }),
});
export { batimentsMachinesAgricolesRequestSchema };
//# sourceMappingURL=batiments-machines-agricoles-request.js.map