import { z } from 'zod';
declare const kilometresSchema: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Quantity<"Kilometres">, string>>;
declare const relativeChangeSchema: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Quantity<"RelativeChange">, string>>;
declare const fractionSchema: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Fraction, string>>;
declare const nonNegativeHectaresSchema: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Quantity<"Hectares">, string>>;
declare const nonNegativeHectaresPerYearSchema: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Quantity<"HectaresPerYear">, string>>;
declare const positiveYearsSchema: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Quantity<"Years">, string>>;
declare const nonNegativeTonneKilometresSchema: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../../domain/units.ts").Quantity<"TonneKilometres">, string>>;
declare const territorySchema: z.ZodObject<{
    level: z.ZodEnum<{
        departement: "departement";
        epci: "epci";
        region: "region";
    }>;
    code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
}, z.core.$strict>;
export { fractionSchema, kilometresSchema, nonNegativeHectaresPerYearSchema, nonNegativeHectaresSchema, nonNegativeTonneKilometresSchema, positiveYearsSchema, relativeChangeSchema, territorySchema, };
