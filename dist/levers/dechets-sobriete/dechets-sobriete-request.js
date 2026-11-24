import { z } from 'zod';
import { fractionSchema, territorySchema } from "../../application/estimate/shared-schemas.js";
const dechetsSobrieteRequestSchema = z.strictObject({
    id: z.literal('dechets_sobriete'),
    territory: territorySchema,
    parameters: z.strictObject({
        storageReductionFraction: fractionSchema,
        incinerationReductionFraction: fractionSchema,
    }),
});
export { dechetsSobrieteRequestSchema };
//# sourceMappingURL=dechets-sobriete-request.js.map