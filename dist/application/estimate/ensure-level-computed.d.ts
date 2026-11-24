import { type Result } from 'neverthrow';
import { type ComputedLevels, type ComputedStatus, type LeverId } from '../../domain/lever-registry.ts';
import type { Level } from '../../domain/territory.ts';
import { type LevelNotComputed } from './estimation-error.ts';
declare function ensureLevelComputed<L extends LeverId>({ lever, level, }: {
    lever: L;
    level: Level;
}): Result<ComputedLevels<L>, LevelNotComputed>;
declare function computedStatusOf({ lever, level, }: {
    lever: LeverId;
    level: Level;
}): Result<ComputedStatus, LevelNotComputed>;
export { computedStatusOf, ensureLevelComputed };
