import { z } from 'zod';
import { fractionSchema, territorySchema } from "../../application/estimate/shared-schemas.js";
const transportPersonnesSobrieteDeplacementsRequestSchema = z.strictObject({
    id: z.literal('transport_personnes_sobriete_deplacements'),
    territory: territorySchema,
    parameters: z.strictObject({
        commutingDistanceReductionFraction: fractionSchema,
        railShareFraction: fractionSchema.optional(),
    }),
});
export { transportPersonnesSobrieteDeplacementsRequestSchema };
//# sourceMappingURL=transport-personnes-sobriete-deplacements-request.js.map