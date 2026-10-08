import { err, type Result } from 'neverthrow'
import type { z } from 'zod'
import type { LeverId } from '../../domain/lever-registry.js'
import type { Level } from '../../domain/territory.js'
import { ensureLevelComputed } from './ensure-level-computed.js'
import {
  invalidRequest,
  type InvalidRequest,
  type LevelNotComputed,
} from './estimation-error.js'

type RequestEnvelope = {
  readonly id: LeverId
  readonly territory: { readonly level: Level }
}

function parameterOf(issue: z.core.$ZodIssue): string {
  const unrecognizedKeys = issue.code === 'unrecognized_keys' ? issue.keys : []
  return [...issue.path.map(String), ...unrecognizedKeys].join('.')
}

function parseLeverRequest<S extends z.ZodType<RequestEnvelope>>(
  schema: S,
  input: z.input<S>,
): Result<z.output<S>, InvalidRequest | LevelNotComputed> {
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
  const { id, territory } = parsed.data
  return ensureLevelComputed({ lever: id, level: territory.level }).map(() => parsed.data)
}

export { parseLeverRequest }
