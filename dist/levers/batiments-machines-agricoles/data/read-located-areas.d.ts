import { Result } from 'neverthrow';
import type { RegionLookup } from '../../../application/estimate/estimation-context.ts';
import type { DataSource, DataSourceError } from '../../../domain/data-source.ts';
import type { LocatedArea } from './calculate-regional-area-shares.ts';
declare function readLocatedAreas({ dataSource, getRegionByCommune, }: {
    dataSource: DataSource;
    getRegionByCommune: RegionLookup;
}): Result<readonly LocatedArea[], DataSourceError>;
export { readLocatedAreas };
