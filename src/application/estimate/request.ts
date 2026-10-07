import { err, ok, type Result } from 'neverthrow'
import { z } from 'zod'
import { numberToDecimalText, parseBig } from '../../domain/big-number.js'
import { levels, parseTerritoryCode } from '../../domain/territory.js'
import { quantity } from '../../domain/units.js'
import { invalidRequest, type InvalidRequest } from './estimation-error.js'

const decimalTextSchema = z
  .string()
  .refine((text) => parseBig(text).isOk(), 'must be a decimal number')

const kilometresSchema = z
  .union([decimalTextSchema, z.number().transform(numberToDecimalText)])
  .transform((text) => quantity<'Kilometres'>(text))

const territoryCodeSchema = z.string().transform((value, context) =>
  parseTerritoryCode(value).match(
    (code) => code,
    () => {
      context.addIssue({ code: 'custom', message: 'must not be empty', input: value })
      return z.NEVER
    },
  ),
)

const territorySchema = z.strictObject({
  level: z.enum(levels),
  code: territoryCodeSchema,
})

const haiesRequestSchema = z.strictObject({
  id: z.literal('haies'),
  territory: territorySchema,
  parameters: z.strictObject({ hedgeKmCreatedPerYear: kilometresSchema }),
})

const requestSchema = z.discriminatedUnion('id', [haiesRequestSchema])

type RequestInput = z.input<typeof requestSchema>
type Request = z.output<typeof requestSchema>
type Lever = Request['id']

function parameterOf(issue: z.core.$ZodIssue): string {
  const unrecognizedKeys = issue.code === 'unrecognized_keys' ? issue.keys : []
  return [...issue.path.map(String), ...unrecognizedKeys].join('.') || 'request'
}

function parseRequest(input: RequestInput): Result<Request, InvalidRequest> {
  const parsed = requestSchema.safeParse(input)
  return parsed.success
    ? ok(parsed.data)
    : err(
        invalidRequest(
          parsed.error.issues.map((issue) => ({
            parameter: parameterOf(issue),
            message: issue.message,
          })),
        ),
      )
}

export { parseRequest }
export type { Lever, Request, RequestInput }
