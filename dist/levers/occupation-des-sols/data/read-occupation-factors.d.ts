import { Result } from 'neverthrow';
import type { DataSource, DataSourceError } from '../../../domain/data-source.ts';
import type { Level, Territory } from '../../../domain/territory.ts';
import type { OccupationFactors } from './occupation-data.ts';
declare function readOccupationFactors({ dataSource, territory, }: {
    dataSource: DataSource;
    territory: Territory<Level>;
}): Result<OccupationFactors, DataSourceError>;
export { readOccupationFactors };
