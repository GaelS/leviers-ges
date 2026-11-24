import { z } from 'zod';
import type { ComputedLevels } from '../../domain/lever-registry.ts';
declare const residentielSobrieteRequestSchema: z.ZodObject<{
    id: z.ZodLiteral<"residentiel_sobriete">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        householdsApplyingSobrietyFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Fraction, string>>;
        consumptionReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Fraction, string>>;
    }, z.core.$strict>;
}, z.core.$strict>;
type ResidentielSobrieteRequestInput = z.input<typeof residentielSobrieteRequestSchema>;
type ResidentielSobrieteRequest = z.output<typeof residentielSobrieteRequestSchema> & {
    readonly territory: {
        readonly level: ComputedLevels<'residentiel_sobriete'>;
    };
};
export { residentielSobrieteRequestSchema };
export type { ResidentielSobrieteRequest, ResidentielSobrieteRequestInput };
