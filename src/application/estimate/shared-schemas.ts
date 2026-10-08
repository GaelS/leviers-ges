import { z } from 'zod'
import { numberToDecimalText, parseBig } from '../../domain/big-number.ts'
import { levels, territoryCodeSchema } from '../../domain/territory.ts'
import { parseFraction, quantity } from '../../domain/units.ts'

const decimalInputSchema = z.union([
  z.string().refine((text) => parseBig(text).isOk(), 'must be a decimal number'),
  z.number().transform(numberToDecimalText),
])

const kilometresSchema = decimalInputSchema.transform((text) => quantity<'Kilometres'>(text))

const fractionSchema = decimalInputSchema.transform((text, context) =>
  parseFraction(text).match(
    (fraction) => fraction,
    () => {
      context.addIssue({ code: 'custom', message: 'must be between 0 and 1', input: text })
      return z.NEVER
    },
  ),
)

const territorySchema = z.strictObject({
  level: z.enum(levels),
  code: territoryCodeSchema,
})

export { fractionSchema, kilometresSchema, territorySchema }
