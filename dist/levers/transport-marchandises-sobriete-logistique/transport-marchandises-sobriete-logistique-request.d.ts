import { z } from 'zod';
import type { ComputedLevels } from '../../domain/lever-registry.ts';
declare const transportMarchandisesSobrieteLogistiqueRequestSchema: z.ZodObject<{
    id: z.ZodLiteral<"transport_marchandises_sobriete_logistique">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        roadFreightReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Fraction, string>>;
    }, z.core.$strict>;
}, z.core.$strict>;
type TransportMarchandisesSobrieteLogistiqueRequestInput = z.input<typeof transportMarchandisesSobrieteLogistiqueRequestSchema>;
type TransportMarchandisesSobrieteLogistiqueRequest = z.output<typeof transportMarchandisesSobrieteLogistiqueRequestSchema> & {
    readonly territory: {
        readonly level: ComputedLevels<'transport_marchandises_sobriete_logistique'>;
    };
};
export { transportMarchandisesSobrieteLogistiqueRequestSchema };
export type { TransportMarchandisesSobrieteLogistiqueRequest, TransportMarchandisesSobrieteLogistiqueRequestInput, };
