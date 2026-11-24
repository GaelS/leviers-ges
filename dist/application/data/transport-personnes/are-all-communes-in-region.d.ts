import { Result } from 'neverthrow';
import type { DataSourceError } from '../../../domain/data-source.ts';
import type { RegionLookup } from '../../estimate/estimation-context.ts';
declare function areAllCommunesInRegion({ communes, regionCode, getRegionByCommune, }: {
    communes: readonly string[];
    regionCode: string;
    getRegionByCommune: RegionLookup;
}): Result<boolean, DataSourceError>;
export { areAllCommunesInRegion };
