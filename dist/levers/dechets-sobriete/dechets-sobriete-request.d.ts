import { z } from 'zod';
import type { ComputedLevels } from '../../domain/lever-registry.ts';
declare const dechetsSobrieteRequestSchema: z.ZodObject<{
    id: z.ZodLiteral<"dechets_sobriete">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        storageReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Fraction, string>>;
        incinerationReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Fraction, string>>;
    }, z.core.$strict>;
}, z.core.$strict>;
type DechetsSobrieteRequestInput = z.input<typeof dechetsSobrieteRequestSchema>;
type DechetsSobrieteRequest = z.output<typeof dechetsSobrieteRequestSchema> & {
    readonly territory: {
        readonly level: ComputedLevels<'dechets_sobriete'>;
    };
};
export { dechetsSobrieteRequestSchema };
export type { DechetsSobrieteRequest, DechetsSobrieteRequestInput };
