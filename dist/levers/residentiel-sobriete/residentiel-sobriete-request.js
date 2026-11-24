import { z } from 'zod';
import { fractionSchema, territorySchema } from "../../application/estimate/shared-schemas.js";
const residentielSobrieteRequestSchema = z.strictObject({
    id: z.literal('residentiel_sobriete'),
    territory: territorySchema,
    parameters: z.strictObject({
        householdsApplyingSobrietyFraction: fractionSchema,
        consumptionReductionFraction: fractionSchema,
    }),
});
export { residentielSobrieteRequestSchema };
//# sourceMappingURL=residentiel-sobriete-request.js.map