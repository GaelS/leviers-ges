import { z } from 'zod';
import { nonNegativeHectaresPerYearSchema, positiveYearsSchema, territorySchema, } from "../../application/estimate/shared-schemas.js";
const occupationDesSolsRequestSchema = z.strictObject({
    id: z.literal('occupation_des_sols'),
    territory: territorySchema,
    parameters: z.strictObject({
        afforestationHectaresPerYear: nonNegativeHectaresPerYearSchema,
        wetlandDevelopmentHectaresPerYear: nonNegativeHectaresPerYearSchema,
        desealingHectaresPerYear: nonNegativeHectaresPerYearSchema,
        horizonYears: positiveYearsSchema,
    }),
});
export { occupationDesSolsRequestSchema };
//# sourceMappingURL=occupation-des-sols-request.js.map