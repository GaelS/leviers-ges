import { Result } from 'neverthrow';
import type { DataSource, DataSourceError } from '../../../domain/data-source.ts';
import type { Level, Territory } from '../../../domain/territory.ts';
import type { OccupationAreas } from './occupation-data.ts';
declare function readOccupationAreas({ dataSource, territory, }: {
    dataSource: DataSource;
    territory: Territory<Level>;
}): Result<OccupationAreas, DataSourceError>;
export { readOccupationAreas };
