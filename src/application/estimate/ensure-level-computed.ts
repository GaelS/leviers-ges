import { err, ok, type Result } from 'neverthrow'
import { getStatus, isComputed, type LeverId } from '../../domain/lever-registry.ts'
import type { Level } from '../../domain/territory.ts'
import { levelNotComputed, type LevelNotComputed } from './estimation-error.ts'

function ensureLevelComputed({
  lever,
  level,
}: {
  lever: LeverId
  level: Level
}): Result<void, LevelNotComputed> {
  return isComputed(getStatus({ lever, level })) ? ok() : err(levelNotComputed({ lever, level }))
}

export { ensureLevelComputed }
