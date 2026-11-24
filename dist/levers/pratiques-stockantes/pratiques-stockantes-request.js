import { z } from 'zod';
import { nonNegativeHectaresSchema } from "../../application/estimate/shared-schemas.js";
const pratiquesStockantesRequestSchema = z.strictObject({
    id: z.literal('pratiques_stockantes'),
    parameters: z.strictObject({
        intermediateCropsHectares: nonNegativeHectaresSchema,
        permanentVineyardGrassingHectares: nonNegativeHectaresSchema,
        winterIntercropVineyardHectares: nonNegativeHectaresSchema,
        agroforestryHectares: nonNegativeHectaresSchema,
        temporaryGrasslandExtensionHectares: nonNegativeHectaresSchema,
    }),
});
export { pratiquesStockantesRequestSchema };
//# sourceMappingURL=pratiques-stockantes-request.js.map