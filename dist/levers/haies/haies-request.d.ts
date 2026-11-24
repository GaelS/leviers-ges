import { z } from 'zod';
declare const haiesRequestSchema: z.ZodObject<{
    id: z.ZodLiteral<"haies">;
    parameters: z.ZodObject<{
        hedgeKmCreatedPerYear: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Quantity<"Kilometres">, string>>;
    }, z.core.$strict>;
}, z.core.$strict>;
type HaiesRequestInput = z.input<typeof haiesRequestSchema>;
type HaiesRequest = z.output<typeof haiesRequestSchema>;
export { haiesRequestSchema };
export type { HaiesRequest, HaiesRequestInput };
