import { z } from 'zod';
import { kilometresSchema } from "../../application/estimate/shared-schemas.js";
const haiesRequestSchema = z.strictObject({
    id: z.literal('haies'),
    parameters: z.strictObject({ hedgeKmCreatedPerYear: kilometresSchema }),
});
export { haiesRequestSchema };
//# sourceMappingURL=haies-request.js.map