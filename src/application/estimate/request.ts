import { err, ok, type Result } from 'neverthrow'
import { z } from 'zod'
import { invalidRequest, type InvalidRequest } from './estimation-error.js'
import { haiesRequestSchema } from './haies-request.js'
import { reseauxChaleurRequestSchema } from './reseaux-chaleur-request.js'

const requestSchema = z.discriminatedUnion('id', [haiesRequestSchema, reseauxChaleurRequestSchema])

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
