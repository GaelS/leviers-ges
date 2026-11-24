import { z } from 'zod';
import type { ComputedLevels } from '../../domain/lever-registry.ts';
declare const occupationDesSolsRequestSchema: z.ZodObject<{
    id: z.ZodLiteral<"occupation_des_sols">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        afforestationHectaresPerYear: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Quantity<"HectaresPerYear">, string>>;
        wetlandDevelopmentHectaresPerYear: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Quantity<"HectaresPerYear">, string>>;
        desealingHectaresPerYear: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Quantity<"HectaresPerYear">, string>>;
        horizonYears: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Quantity<"Years">, string>>;
    }, z.core.$strict>;
}, z.core.$strict>;
type OccupationDesSolsRequestInput = z.input<typeof occupationDesSolsRequestSchema>;
type OccupationDesSolsRequest = z.output<typeof occupationDesSolsRequestSchema> & {
    readonly territory: {
        readonly level: ComputedLevels<'occupation_des_sols'>;
    };
};
export { occupationDesSolsRequestSchema };
export type { OccupationDesSolsRequest, OccupationDesSolsRequestInput };
