import { z } from 'zod';
import { relativeChangeSchema, territorySchema } from "../../application/estimate/shared-schemas.js";
const produitsBoisRequestSchema = z.strictObject({
    id: z.literal('produits_bois'),
    territory: territorySchema,
    parameters: z.strictObject({ woodProductionIncrease: relativeChangeSchema }),
});
export { produitsBoisRequestSchema };
//# sourceMappingURL=produits-bois-request.js.map