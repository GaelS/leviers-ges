import { z } from 'zod';
import { fractionSchema, relativeChangeSchema, territorySchema, } from "../../application/estimate/shared-schemas.js";
const passengerIncreaseSchema = relativeChangeSchema.refine((increase) => !increase.isNegative(), 'must be 0 or more');
const transportPersonnesEfficaciteRequestSchema = z.strictObject({
    id: z.literal('transport_personnes_efficacite'),
    territory: territorySchema,
    parameters: z.strictObject({
        carEcodrivingApplicationFraction: fractionSchema,
        busEcodrivingApplicationFraction: fractionSchema,
        carPassengerIncrease: passengerIncreaseSchema,
        busPassengerIncrease: passengerIncreaseSchema,
        railShareFraction: fractionSchema.optional(),
    }),
});
export { transportPersonnesEfficaciteRequestSchema };
//# sourceMappingURL=transport-personnes-efficacite-request.js.map