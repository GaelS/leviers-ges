import { z } from 'zod';
import { fractionSchema, territorySchema } from "../../application/estimate/shared-schemas.js";
const transportMarchandisesElectrificationRequestSchema = z.strictObject({
    id: z.literal('transport_marchandises_electrification'),
    territory: territorySchema,
    parameters: z.strictObject({ additionalElectrifiedFleetFraction: fractionSchema }),
});
export { transportMarchandisesElectrificationRequestSchema };
//# sourceMappingURL=transport-marchandises-electrification-request.js.map