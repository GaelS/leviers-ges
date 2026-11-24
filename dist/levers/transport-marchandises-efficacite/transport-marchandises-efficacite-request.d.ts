import { z } from 'zod';
import type { ComputedLevels } from '../../domain/lever-registry.ts';
declare const transportMarchandisesEfficaciteRequestSchema: z.ZodObject<{
    id: z.ZodLiteral<"transport_marchandises_efficacite">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        ecodrivingApplicationFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Fraction, string>>;
        loadFactorIncrease: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Quantity<"RelativeChange">, string>>;
    }, z.core.$strict>;
}, z.core.$strict>;
type TransportMarchandisesEfficaciteRequestInput = z.input<typeof transportMarchandisesEfficaciteRequestSchema>;
type TransportMarchandisesEfficaciteRequest = z.output<typeof transportMarchandisesEfficaciteRequestSchema> & {
    readonly territory: {
        readonly level: ComputedLevels<'transport_marchandises_efficacite'>;
    };
};
export { transportMarchandisesEfficaciteRequestSchema };
export type { TransportMarchandisesEfficaciteRequest, TransportMarchandisesEfficaciteRequestInput, };
