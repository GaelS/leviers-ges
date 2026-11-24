import { z } from 'zod';
import { fractionSchema, relativeChangeSchema, territorySchema, } from "../../application/estimate/shared-schemas.js";
const loadFactorIncreaseSchema = relativeChangeSchema.refine((increase) => !increase.isNegative(), 'must be 0 or more');
const transportMarchandisesEfficaciteRequestSchema = z.strictObject({
    id: z.literal('transport_marchandises_efficacite'),
    territory: territorySchema,
    parameters: z.strictObject({
        ecodrivingApplicationFraction: fractionSchema,
        loadFactorIncrease: loadFactorIncreaseSchema,
    }),
});
export { transportMarchandisesEfficaciteRequestSchema };
//# sourceMappingURL=transport-marchandises-efficacite-request.js.map