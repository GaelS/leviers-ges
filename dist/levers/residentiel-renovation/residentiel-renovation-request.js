import { z } from 'zod';
import { fractionSchema, territorySchema } from "../../application/estimate/shared-schemas.js";
const residentielRenovationRequestSchema = z.strictObject({
    id: z.literal('residentiel_renovation'),
    territory: territorySchema,
    parameters: z.strictObject({
        renovatedParcFraction: fractionSchema,
    }),
});
export { residentielRenovationRequestSchema };
//# sourceMappingURL=residentiel-renovation-request.js.map