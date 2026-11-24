import type { Result } from 'neverthrow';
import type { DataSource, DataSourceError } from '../../../domain/data-source.ts';
import type { Territory } from '../../../domain/territory.ts';
import type { NitrogenDelivered } from './nitrogen-delivered.ts';
declare function readNitrogenDelivered({ dataSource, territory, }: {
    dataSource: DataSource;
    territory: Territory<'region' | 'departement'>;
}): Result<NitrogenDelivered, DataSourceError>;
export { readNitrogenDelivered };
