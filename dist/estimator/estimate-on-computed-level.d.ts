import type { Result } from 'neverthrow';
import type { EstimateResult } from '../application/estimate/estimate-result.ts';
import type { EstimationError } from '../application/estimate/estimation-error.ts';
import type { ComputedLevels, LeverId } from '../domain/lever-registry.ts';
import type { Level } from '../domain/territory.ts';
type TerritorialRequest = {
    readonly id: LeverId;
    readonly territory: {
        readonly level: Level;
    };
};
type RequestOnComputedLevel<R extends TerritorialRequest> = R & {
    readonly territory: {
        readonly level: ComputedLevels<R['id']>;
    };
};
declare function estimateOnComputedLevel<R extends TerritorialRequest>(request: R, estimateLever: (request: RequestOnComputedLevel<R>) => Result<EstimateResult, EstimationError>): Result<EstimateResult, EstimationError>;
export { estimateOnComputedLevel };
