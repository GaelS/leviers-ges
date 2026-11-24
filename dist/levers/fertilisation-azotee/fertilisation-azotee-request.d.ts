import { z } from 'zod';
import type { ComputedLevels } from '../../domain/lever-registry.ts';
declare const fertilisationAzoteeRequestSchema: z.ZodObject<{
    id: z.ZodLiteral<"fertilisation_azotee">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        nitrogenReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Fraction, string>>;
    }, z.core.$strict>;
}, z.core.$strict>;
type FertilisationAzoteeRequestInput = z.input<typeof fertilisationAzoteeRequestSchema>;
type FertilisationAzoteeRequest = z.output<typeof fertilisationAzoteeRequestSchema> & {
    readonly territory: {
        readonly level: ComputedLevels<'fertilisation_azotee'>;
    };
};
export { fertilisationAzoteeRequestSchema };
export type { FertilisationAzoteeRequest, FertilisationAzoteeRequestInput };
