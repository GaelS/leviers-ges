import { z } from 'zod';
import type { ComputedLevels } from '../../domain/lever-registry.ts';
declare const transportPersonnesSobrieteDeplacementsRequestSchema: z.ZodObject<{
    id: z.ZodLiteral<"transport_personnes_sobriete_deplacements">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        commutingDistanceReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Fraction, string>>;
        railShareFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Fraction, string>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
type TransportPersonnesSobrieteDeplacementsRequestInput = z.input<typeof transportPersonnesSobrieteDeplacementsRequestSchema>;
type TransportPersonnesSobrieteDeplacementsRequest = z.output<typeof transportPersonnesSobrieteDeplacementsRequestSchema> & {
    readonly territory: {
        readonly level: ComputedLevels<'transport_personnes_sobriete_deplacements'>;
    };
};
export { transportPersonnesSobrieteDeplacementsRequestSchema };
export type { TransportPersonnesSobrieteDeplacementsRequest, TransportPersonnesSobrieteDeplacementsRequestInput, };
