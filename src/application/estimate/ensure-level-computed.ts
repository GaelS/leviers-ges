import { err, ok, type Result } from 'neverthrow'
import { isComputedLevel, type ComputedLevels, type LeverId } from '../../domain/lever-registry.ts'
import type { Level } from '../../domain/territory.ts'
import { levelNotComputed, type LevelNotComputed } from './estimation-error.ts'

function ensureLevelComputed<L extends LeverId>({
  lever,
  level,
}: {
  lever: L
  level: Level
}): Result<ComputedLevels<L>, LevelNotComputed> {
  return isComputedLevel(lever, level) ? ok(level) : err(levelNotComputed({ lever, level }))
}

export { ensureLevelComputed }
