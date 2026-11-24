import { Result } from 'neverthrow';
import { type DataSource, type DataSourceError } from '../../domain/data-source.ts';
import type { HeatNetwork } from '../../domain/heat-network.ts';
import type { Territory } from '../../domain/territory.ts';
import type { ResidentialConsumption } from '../../domain/residential-consumption.ts';
declare function readEpciConsumption({ dataSource, territory, networks, }: {
    dataSource: DataSource;
    territory: Territory<'epci'>;
    networks: readonly HeatNetwork[];
}): Result<ResidentialConsumption, DataSourceError>;
export { readEpciConsumption };
