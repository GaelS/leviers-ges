import type { Result } from 'neverthrow';
import type { RegionLookup } from '../../estimate/estimation-context.ts';
import type { DataSourceError } from '../../../domain/data-source.ts';
import type { RailEmissionFactor } from './rail-emission-factor.ts';
declare function resolveRailEmissionFactor({ communes, getRegionByCommune, }: {
    communes: readonly string[];
    getRegionByCommune: RegionLookup;
}): Result<RailEmissionFactor, DataSourceError>;
export { resolveRailEmissionFactor };
