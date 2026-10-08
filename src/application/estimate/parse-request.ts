import { err, ok, type Result } from 'neverthrow'
import type { z } from 'zod'
import type { LeverId } from '../../domain/lever-registry.ts'
import type { Level } from '../../domain/territory.ts'
import { ensureLevelComputed } from './ensure-level-computed.ts'
import {
  invalidRequest,
  type InvalidRequest,
  type LevelNotComputed,
} from './estimation-error.ts'

type LeverRequest = {
  readonly id: LeverId
}

type TerritorialLeverRequest = LeverRequest & {
  readonly territory: { readonly level: Level }
}

function parameterOf(issue: z.core.$ZodIssue): string {
  const unrecognizedKeys = issue.code === 'unrecognized_keys' ? issue.keys : []
  return [...issue.path.map(String), ...unrecognizedKeys].join('.')
}

function parseLeverRequest<S extends z.ZodType<LeverRequest>>(
  schema: S,
  input: z.input<S>,
): Result<z.output<S>, InvalidRequest> {
  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    return err(
      invalidRequest(
        parsed.error.issues.map((issue) => ({
          parameter: parameterOf(issue),
          message: issue.message,
        })),
      ),
    )
  }
  return ok(parsed.data)
}

function parseTerritorialLeverRequest<S extends z.ZodType<TerritorialLeverRequest>>(
  schema: S,
  input: z.input<S>,
): Result<z.output<S>, InvalidRequest | LevelNotComputed> {
  return parseLeverRequest(schema, input).andThen((request) =>
    ensureLevelComputed({ lever: request.id, level: request.territory.level }).map(() => request),
  )
}

export { parseLeverRequest, parseTerritorialLeverRequest }
