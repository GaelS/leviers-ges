import type { Result } from 'neverthrow';
import type { DataRow, DataSource, DataSourceError } from '../../../domain/data-source.ts';
import type { Level, Territory } from '../../../domain/territory.ts';
type TransportRow = {
    readonly dataset: string;
    readonly row: DataRow;
};
declare function readTransportRow({ dataSource, territory, }: {
    dataSource: DataSource;
    territory: Territory<Level>;
}): Result<TransportRow, DataSourceError>;
export { readTransportRow };
export type { TransportRow };
