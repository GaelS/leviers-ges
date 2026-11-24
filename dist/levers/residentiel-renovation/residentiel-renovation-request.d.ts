import { z } from 'zod';
import type { ComputedLevels } from '../../domain/lever-registry.ts';
declare const residentielRenovationRequestSchema: z.ZodObject<{
    id: z.ZodLiteral<"residentiel_renovation">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        renovatedParcFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Fraction, string>>;
    }, z.core.$strict>;
}, z.core.$strict>;
type ResidentielRenovationRequestInput = z.input<typeof residentielRenovationRequestSchema>;
type ResidentielRenovationRequest = z.output<typeof residentielRenovationRequestSchema> & {
    readonly territory: {
        readonly level: ComputedLevels<'residentiel_renovation'>;
    };
};
export { residentielRenovationRequestSchema };
export type { ResidentielRenovationRequest, ResidentielRenovationRequestInput };
