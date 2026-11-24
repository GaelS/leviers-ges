import { type Result } from 'neverthrow';
import type { DataSourceError } from '../../../domain/data-source.ts';
import type { RegionLookup } from '../../estimate/estimation-context.ts';
import { type Fraction } from '../../../domain/units.ts';
type RailShare = {
    readonly fraction: Fraction;
    readonly defaulted: boolean;
};
declare function resolveRailShare({ requested, communes, getRegionByCommune, }: {
    requested: Fraction | undefined;
    communes: readonly string[];
    getRegionByCommune: RegionLookup;
}): Result<RailShare, DataSourceError>;
export { resolveRailShare };
export type { RailShare };
