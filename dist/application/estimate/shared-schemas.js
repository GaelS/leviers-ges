import { z } from 'zod';
import { numberToDecimalText, parseBig } from "../../domain/big-number.js";
import { levels, territoryCodeSchema } from "../../domain/territory.js";
import { parseFraction, quantity } from "../../domain/units.js";
const decimalInputSchema = z.union([
    z.string().refine((text) => parseBig(text).isOk(), 'must be a decimal number'),
    z.number().transform(numberToDecimalText),
]);
const kilometresSchema = decimalInputSchema.transform((text) => quantity(text));
const relativeChangeSchema = decimalInputSchema.transform((text) => quantity(text));
const fractionSchema = decimalInputSchema.transform((text, context) => parseFraction(text).match((fraction) => fraction, () => {
    context.addIssue({ code: 'custom', message: 'must be between 0 and 1', input: text });
    return z.NEVER;
}));
const nonNegativeHectaresSchema = decimalInputSchema.transform((text, context) => {
    const hectares = quantity(text);
    if (!hectares.isNegative())
        return hectares;
    context.addIssue({ code: 'custom', message: 'must not be negative', input: text });
    return z.NEVER;
});
const nonNegativeHectaresPerYearSchema = decimalInputSchema.transform((text, context) => {
    const hectaresPerYear = quantity(text);
    if (!hectaresPerYear.isNegative())
        return hectaresPerYear;
    context.addIssue({ code: 'custom', message: 'must not be negative', input: text });
    return z.NEVER;
});
const positiveYearsSchema = decimalInputSchema.transform((text, context) => {
    const years = quantity(text);
    if (years.isGreaterThan(0))
        return years;
    context.addIssue({ code: 'custom', message: 'must be greater than 0', input: text });
    return z.NEVER;
});
const nonNegativeTonneKilometresSchema = decimalInputSchema.transform((text, context) => {
    const tonneKilometres = quantity(text);
    if (!tonneKilometres.isNegative())
        return tonneKilometres;
    context.addIssue({ code: 'custom', message: 'must not be negative', input: text });
    return z.NEVER;
});
const territorySchema = z.strictObject({
    level: z.enum(levels),
    code: territoryCodeSchema,
});
export { fractionSchema, kilometresSchema, nonNegativeHectaresPerYearSchema, nonNegativeHectaresSchema, nonNegativeTonneKilometresSchema, positiveYearsSchema, relativeChangeSchema, territorySchema, };
//# sourceMappingURL=shared-schemas.js.map