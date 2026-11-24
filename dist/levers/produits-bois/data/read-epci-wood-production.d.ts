import { Result } from 'neverthrow';
import { type DataSource, type DataSourceError } from '../../../domain/data-source.ts';
import type { Territory } from '../../../domain/territory.ts';
import type { WoodProduction } from './wood-production.ts';
declare function readEpciWoodProduction({ dataSource, territory, }: {
    dataSource: DataSource;
    territory: Territory<'epci'>;
}): Result<WoodProduction, DataSourceError>;
export { readEpciWoodProduction };
