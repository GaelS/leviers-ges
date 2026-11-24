import { z } from 'zod';
import type { ComputedLevels } from '../../domain/lever-registry.ts';
import { type Fraction } from '../../domain/units.ts';
declare const residentielChangementSystemeChauffageRequestSchema: z.ZodObject<{
    id: z.ZodLiteral<"residentiel_changement_systeme_chauffage">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        targetElectricityShareFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<Fraction, string>>>;
        targetNaturalGasShareFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<Fraction, string>>>;
        targetFuelOilShareFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<Fraction, string>>>;
        targetWoodShareFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<Fraction, string>>>;
        targetHeatNetworkShareFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<Fraction, string>>>;
    }, z.core.$strict>;
}, z.core.$strict>;
type ResidentielChangementSystemeChauffageRequestInput = z.input<typeof residentielChangementSystemeChauffageRequestSchema>;
type ResidentielChangementSystemeChauffageRequest = z.output<typeof residentielChangementSystemeChauffageRequestSchema> & {
    readonly territory: {
        readonly level: ComputedLevels<'residentiel_changement_systeme_chauffage'>;
    };
};
export { residentielChangementSystemeChauffageRequestSchema };
export type { ResidentielChangementSystemeChauffageRequest, ResidentielChangementSystemeChauffageRequestInput, };
