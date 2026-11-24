import type { DataSourceError } from '../../domain/data-source.ts';
import type { LeverId } from '../../domain/lever-registry.ts';
import type { Level } from '../../domain/territory.ts';
import type { UnknownTerritory } from '../../domain/territory-index.ts';
type InvalidRequest = {
    readonly kind: 'invalid_request';
    readonly issues: ReadonlyArray<{
        readonly parameter: string;
        readonly message: string;
    }>;
};
type LevelNotComputed = {
    readonly kind: 'level_not_computed';
    readonly lever: LeverId;
    readonly level: Level;
};
type EstimationError = InvalidRequest | LevelNotComputed | UnknownTerritory | DataSourceError;
declare function invalidRequest(issues: InvalidRequest['issues']): InvalidRequest;
declare function levelNotComputed({ lever, level }: Pick<LevelNotComputed, 'lever' | 'level'>): LevelNotComputed;
export { invalidRequest, levelNotComputed };
export type { EstimationError, InvalidRequest, LevelNotComputed };
