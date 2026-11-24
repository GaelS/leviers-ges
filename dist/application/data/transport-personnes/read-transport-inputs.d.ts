import { Result } from 'neverthrow';
import type { DataSource, DataSourceError } from '../../../domain/data-source.ts';
import type { Level, Territory } from '../../../domain/territory.ts';
import type { TransportInputs } from './transport-inputs.ts';
declare function readTransportInputs({ dataSource, territory, }: {
    dataSource: DataSource;
    territory: Territory<Level>;
}): Result<TransportInputs, DataSourceError>;
export { readTransportInputs };
