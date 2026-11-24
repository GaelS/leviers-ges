import { z } from 'zod';
declare const reseauxChaleurRequestSchema: z.ZodObject<{
    id: z.ZodLiteral<"reseaux_chaleur">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        emissionFactorReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Fraction, string>>;
    }, z.core.$strict>;
}, z.core.$strict>;
type ReseauxChaleurRequestInput = z.input<typeof reseauxChaleurRequestSchema>;
type ReseauxChaleurRequest = z.output<typeof reseauxChaleurRequestSchema>;
export { reseauxChaleurRequestSchema };
export type { ReseauxChaleurRequest, ReseauxChaleurRequestInput };
