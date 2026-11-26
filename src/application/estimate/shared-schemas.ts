import { z } from 'zod'
import { decimalTextPattern, numberToDecimalText } from '../../domain/big-number.ts'
import { levels, territoryCodeSchema } from '../../domain/territory.ts'
import { parseFraction, parseReductionFraction, quantity } from '../../domain/units.ts'

const decimalInputSchema = z.union([
  z.string().regex(decimalTextPattern, 'must be a decimal number'),
  z.number().transform(numberToDecimalText),
])

const kilometresSchema = decimalInputSchema.transform((text) => quantity<'Kilometres'>(text))

const relativeChangeSchema = decimalInputSchema.transform((text) => quantity<'RelativeChange'>(text))

const fractionSchema =decimalInputSchema.transform((text, context) =>
  parseFraction(text).match(
    (fraction) => fraction,
    () => {
      context.addIssue({
      code: 'custom',
      message: 'must be between 0 and 1',
      input: text,
      params: { code: 'out_of_range' },
    })
      return z.NEVER
    },
  ),
).meta({ description: 'Fraction décimale de 0 à 1, en texte ou en nombre' })

const reductionFractionSchema = decimalInputSchema.transform((text, context) =>
  parseReductionFraction(text).match(
    (reduction) => reduction,
    () => {
      context.addIssue({
      code: 'custom',
      message: 'must be at most 1',
      input: text,
      params: { code: 'out_of_range' },
    })
      return z.NEVER
    },
  ),
).meta({ description: 'Réduction décimale au plus égale à 1 ; une valeur négative est une hausse' })

const nonNegativeHectaresSchema = decimalInputSchema.transform((text, context) => {
  const hectares = quantity<'Hectares'>(text)
  if (!hectares.isNegative()) return hectares
  context.addIssue({
      code: 'custom',
      message: 'must not be negative',
      input: text,
      params: { code: 'out_of_range' },
    })
  return z.NEVER
}).meta({ description: 'Surface en hectares, décimale positive ou nulle' })

const nonNegativeHectaresPerYearSchema = decimalInputSchema.transform((text, context) => {
  const hectaresPerYear = quantity<'HectaresPerYear'>(text)
  if (!hectaresPerYear.isNegative()) return hectaresPerYear
  context.addIssue({
      code: 'custom',
      message: 'must not be negative',
      input: text,
      params: { code: 'out_of_range' },
    })
  return z.NEVER
}).meta({ description: 'Surface en hectares par an, décimale positive ou nulle' })

const positiveYearsSchema = decimalInputSchema.transform((text, context) => {
  const years = quantity<'Years'>(text)
  if (years.isGreaterThan(0)) return years
  context.addIssue({
      code: 'custom',
      message: 'must be greater than 0',
      input: text,
      params: { code: 'out_of_range' },
    })
  return z.NEVER
}).meta({ description: 'Nombre d’années, décimal strictement positif' })

const nonNegativeTonneKilometresSchema = decimalInputSchema.transform((text, context) => {
  const tonneKilometres = quantity<'TonneKilometres'>(text)
  if (!tonneKilometres.isNegative()) return tonneKilometres
  context.addIssue({
      code: 'custom',
      message: 'must not be negative',
      input: text,
      params: { code: 'out_of_range' },
    })
  return z.NEVER
}).meta({ description: 'Tonnes.kilomètres, décimal positif ou nul' })

const territorySchema = z.strictObject({
  level: z.enum(levels),
  code: territoryCodeSchema,
})

export {
  fractionSchema,
  kilometresSchema,
  nonNegativeHectaresPerYearSchema,
  nonNegativeHectaresSchema,
  nonNegativeTonneKilometresSchema,
  positiveYearsSchema,
  reductionFractionSchema,
  relativeChangeSchema,
  territorySchema,
}
