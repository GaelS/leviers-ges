import { z } from 'zod';
import { fractionSchema, territorySchema } from "../../application/estimate/shared-schemas.js";
const fertilisationAzoteeRequestSchema = z.strictObject({
    id: z.literal('fertilisation_azotee'),
    territory: territorySchema,
    parameters: z.strictObject({ nitrogenReductionFraction: fractionSchema }),
});
export { fertilisationAzoteeRequestSchema };
//# sourceMappingURL=fertilisation-azotee-request.js.map