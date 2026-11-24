import { z } from 'zod';
import { fractionSchema, territorySchema } from "../../application/estimate/shared-schemas.js";
const transportPersonnesElectrificationRequestSchema = z.strictObject({
    id: z.literal('transport_personnes_electrification'),
    territory: territorySchema,
    parameters: z.strictObject({
        carElectrificationFraction: fractionSchema,
        busElectrificationFraction: fractionSchema,
        railShareFraction: fractionSchema.optional(),
    }),
});
export { transportPersonnesElectrificationRequestSchema };
//# sourceMappingURL=transport-personnes-electrification-request.js.map