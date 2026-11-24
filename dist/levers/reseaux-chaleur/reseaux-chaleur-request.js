import { z } from 'zod';
import { fractionSchema, territorySchema } from "../../application/estimate/shared-schemas.js";
const reseauxChaleurRequestSchema = z.strictObject({
    id: z.literal('reseaux_chaleur'),
    territory: territorySchema,
    parameters: z.strictObject({ emissionFactorReductionFraction: fractionSchema }),
});
export { reseauxChaleurRequestSchema };
//# sourceMappingURL=reseaux-chaleur-request.js.map