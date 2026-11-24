import type { Result } from 'neverthrow';
import type { DataSource, DataSourceError } from '../../domain/data-source.ts';
import type { KgCo2ePerKwh } from '../../domain/units.ts';
declare function readHeatEmissionFactor({ dataSource, dataset, communes, }: {
    dataSource: DataSource;
    dataset: string;
    communes: readonly string[];
}): Result<KgCo2ePerKwh, DataSourceError>;
export { readHeatEmissionFactor };
