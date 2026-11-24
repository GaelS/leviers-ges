import { z } from 'zod';
import type { ComputedLevels } from '../../domain/lever-registry.ts';
declare const produitsBoisRequestSchema: z.ZodObject<{
    id: z.ZodLiteral<"produits_bois">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        woodProductionIncrease: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Quantity<"RelativeChange">, string>>;
    }, z.core.$strict>;
}, z.core.$strict>;
type ProduitsBoisRequestInput = z.input<typeof produitsBoisRequestSchema>;
type ProduitsBoisRequest = z.output<typeof produitsBoisRequestSchema> & {
    readonly territory: {
        readonly level: ComputedLevels<'produits_bois'>;
    };
};
export { produitsBoisRequestSchema };
export type { ProduitsBoisRequest, ProduitsBoisRequestInput };
