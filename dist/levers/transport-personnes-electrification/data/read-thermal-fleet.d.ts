import { Result } from 'neverthrow';
import type { DataSource, DataSourceError } from '../../../domain/data-source.ts';
import type { Territory } from '../../../domain/territory.ts';
import type { ComputedLevels } from '../../../domain/lever-registry.ts';
import type { ThermalFleet } from './thermal-fleet.ts';
declare function readThermalFleet({ dataSource, territory, }: {
    dataSource: DataSource;
    territory: Territory<ComputedLevels<'transport_personnes_electrification'>>;
}): Result<ThermalFleet, DataSourceError>;
export { readThermalFleet };
