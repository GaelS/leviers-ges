import { z } from 'zod';
import type { ComputedLevels } from '../../domain/lever-registry.ts';
import { type Fraction } from '../../domain/units.ts';
declare const dechetsModeDeTraitementRequestSchema: z.ZodObject<{
    id: z.ZodLiteral<"dechets_mode_de_traitement">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        storageToIncinerationFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<Fraction, string>>;
        storageToMaterialRecoveryFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<Fraction, string>>;
        incinerationToMaterialRecoveryFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<Fraction, string>>;
    }, z.core.$strict>;
}, z.core.$strict>;
type DechetsModeDeTraitementRequestInput = z.input<typeof dechetsModeDeTraitementRequestSchema>;
type DechetsModeDeTraitementRequest = z.output<typeof dechetsModeDeTraitementRequestSchema> & {
    readonly territory: {
        readonly level: ComputedLevels<'dechets_mode_de_traitement'>;
    };
};
export { dechetsModeDeTraitementRequestSchema };
export type { DechetsModeDeTraitementRequest, DechetsModeDeTraitementRequestInput };
