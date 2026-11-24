import { z } from 'zod';
import type { ComputedLevels } from '../../domain/lever-registry.ts';
import { type Fraction } from '../../domain/units.ts';
declare const transportPersonnesReportModalRequestSchema: z.ZodObject<{
    id: z.ZodLiteral<"transport_personnes_report_modal">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        carToPublicTransportFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<Fraction, string>>;
        carToActiveModesFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<Fraction, string>>;
        publicTransportToActiveModesFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<Fraction, string>>;
        railShareFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<Fraction, string>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
type TransportPersonnesReportModalRequestInput = z.input<typeof transportPersonnesReportModalRequestSchema>;
type TransportPersonnesReportModalRequest = z.output<typeof transportPersonnesReportModalRequestSchema> & {
    readonly territory: {
        readonly level: ComputedLevels<'transport_personnes_report_modal'>;
    };
};
export { transportPersonnesReportModalRequestSchema };
export type { TransportPersonnesReportModalRequest, TransportPersonnesReportModalRequestInput };
