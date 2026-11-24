import { Result } from 'neverthrow';
import type { DataSource, DataSourceError } from '../../domain/data-source.ts';
import type { HeatNetwork } from '../../domain/heat-network.ts';
import type { Level, Territory } from '../../domain/territory.ts';
import type { ResidentialConsumption } from '../../domain/residential-consumption.ts';
declare function readResidentialConsumption({ dataSource, territory, networks, }: {
    dataSource: DataSource;
    territory: Territory<Level>;
    networks: readonly HeatNetwork[];
}): Result<ResidentialConsumption, DataSourceError>;
export { readResidentialConsumption };
