import { z } from 'zod';
import type { ComputedLevels } from '../../domain/lever-registry.ts';
declare const transportMarchandisesElectrificationRequestSchema: z.ZodObject<{
    id: z.ZodLiteral<"transport_marchandises_electrification">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        additionalElectrifiedFleetFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Fraction, string>>;
    }, z.core.$strict>;
}, z.core.$strict>;
type TransportMarchandisesElectrificationRequestInput = z.input<typeof transportMarchandisesElectrificationRequestSchema>;
type TransportMarchandisesElectrificationRequest = z.output<typeof transportMarchandisesElectrificationRequestSchema> & {
    readonly territory: {
        readonly level: ComputedLevels<'transport_marchandises_electrification'>;
    };
};
export { transportMarchandisesElectrificationRequestSchema };
export type { TransportMarchandisesElectrificationRequest, TransportMarchandisesElectrificationRequestInput, };
