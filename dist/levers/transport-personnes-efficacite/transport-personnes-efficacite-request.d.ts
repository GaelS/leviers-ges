import { z } from 'zod';
import type { ComputedLevels } from '../../domain/lever-registry.ts';
declare const transportPersonnesEfficaciteRequestSchema: z.ZodObject<{
    id: z.ZodLiteral<"transport_personnes_efficacite">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        carEcodrivingApplicationFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Fraction, string>>;
        busEcodrivingApplicationFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Fraction, string>>;
        carPassengerIncrease: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Quantity<"RelativeChange">, string>>;
        busPassengerIncrease: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Quantity<"RelativeChange">, string>>;
        railShareFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Fraction, string>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
type TransportPersonnesEfficaciteRequestInput = z.input<typeof transportPersonnesEfficaciteRequestSchema>;
type TransportPersonnesEfficaciteRequest = z.output<typeof transportPersonnesEfficaciteRequestSchema> & {
    readonly territory: {
        readonly level: ComputedLevels<'transport_personnes_efficacite'>;
    };
};
export { transportPersonnesEfficaciteRequestSchema };
export type { TransportPersonnesEfficaciteRequest, TransportPersonnesEfficaciteRequestInput };
