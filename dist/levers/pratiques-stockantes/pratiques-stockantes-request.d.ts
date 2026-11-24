import { z } from 'zod';
declare const pratiquesStockantesRequestSchema: z.ZodObject<{
    id: z.ZodLiteral<"pratiques_stockantes">;
    parameters: z.ZodObject<{
        intermediateCropsHectares: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Quantity<"Hectares">, string>>;
        permanentVineyardGrassingHectares: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Quantity<"Hectares">, string>>;
        winterIntercropVineyardHectares: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Quantity<"Hectares">, string>>;
        agroforestryHectares: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Quantity<"Hectares">, string>>;
        temporaryGrasslandExtensionHectares: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Quantity<"Hectares">, string>>;
    }, z.core.$strict>;
}, z.core.$strict>;
type PratiquesStockantesRequestInput = z.input<typeof pratiquesStockantesRequestSchema>;
type PratiquesStockantesRequest = z.output<typeof pratiquesStockantesRequestSchema>;
export { pratiquesStockantesRequestSchema };
export type { PratiquesStockantesRequest, PratiquesStockantesRequestInput };
