import { z } from 'zod';
import type { ComputedLevels } from '../../domain/lever-registry.ts';
import { type Fraction } from '../../domain/units.ts';
declare const transportMarchandisesReportModalRequestSchema: z.ZodObject<{
    id: z.ZodLiteral<"transport_marchandises_report_modal">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        roadToRailFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<Fraction, string>>;
        roadToWaterwayFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<Fraction, string>>;
        cyclologisticTonneKilometres: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Quantity<"TonneKilometres">, string>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
type TransportMarchandisesReportModalRequestInput = z.input<typeof transportMarchandisesReportModalRequestSchema>;
type TransportMarchandisesReportModalRequest = z.output<typeof transportMarchandisesReportModalRequestSchema> & {
    readonly territory: {
        readonly level: ComputedLevels<'transport_marchandises_report_modal'>;
    };
};
export { transportMarchandisesReportModalRequestSchema };
export type { TransportMarchandisesReportModalRequest, TransportMarchandisesReportModalRequestInput, };
