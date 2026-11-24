import { z } from 'zod';
import type { ComputedLevels } from '../../domain/lever-registry.ts';
declare const transportPersonnesElectrificationRequestSchema: z.ZodObject<{
    id: z.ZodLiteral<"transport_personnes_electrification">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        carElectrificationFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Fraction, string>>;
        busElectrificationFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Fraction, string>>;
        railShareFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Fraction, string>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
type TransportPersonnesElectrificationRequestInput = z.input<typeof transportPersonnesElectrificationRequestSchema>;
type TransportPersonnesElectrificationRequest = z.output<typeof transportPersonnesElectrificationRequestSchema> & {
    readonly territory: {
        readonly level: ComputedLevels<'transport_personnes_electrification'>;
    };
};
export { transportPersonnesElectrificationRequestSchema };
export type { TransportPersonnesElectrificationRequest, TransportPersonnesElectrificationRequestInput, };
