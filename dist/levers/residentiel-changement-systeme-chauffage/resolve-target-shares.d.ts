import { type Result } from 'neverthrow';
import { type InvalidRequest } from '../../application/estimate/estimation-error.ts';
import { type Fraction } from '../../domain/units.ts';
import type { CurrentUsefulShares, TargetShares } from './calculate-residentiel-changement-systeme-chauffage-reduction.ts';
import type { HeatingVector } from './heating-reference.ts';
type RequestedShares = Readonly<Record<HeatingVector, Fraction | undefined>>;
declare function resolveTargetShares({ requested, current, }: {
    requested: RequestedShares;
    current: CurrentUsefulShares;
}): Result<TargetShares, InvalidRequest>;
export { resolveTargetShares };
