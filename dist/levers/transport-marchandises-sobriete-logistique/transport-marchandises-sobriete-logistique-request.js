import { z } from 'zod';
import { fractionSchema, territorySchema } from "../../application/estimate/shared-schemas.js";
const transportMarchandisesSobrieteLogistiqueRequestSchema = z.strictObject({
    id: z.literal('transport_marchandises_sobriete_logistique'),
    territory: territorySchema,
    parameters: z.strictObject({ roadFreightReductionFraction: fractionSchema }),
});
export { transportMarchandisesSobrieteLogistiqueRequestSchema };
//# sourceMappingURL=transport-marchandises-sobriete-logistique-request.js.map