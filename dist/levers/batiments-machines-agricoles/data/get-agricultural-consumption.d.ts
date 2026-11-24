import { Result } from 'neverthrow';
import type { RegionLookup } from '../../../application/estimate/estimation-context.ts';
import type { DataSource, DataSourceError } from '../../../domain/data-source.ts';
import type { Level, Territory } from '../../../domain/territory.ts';
import type { AgriculturalConsumption } from './agricultural-consumption.ts';
declare function getAgriculturalConsumption({ dataSource, territory, communes, getRegionByCommune, }: {
    dataSource: DataSource;
    territory: Territory<Level>;
    communes: readonly string[];
    getRegionByCommune: RegionLookup;
}): Result<AgriculturalConsumption, DataSourceError>;
export { getAgriculturalConsumption };
