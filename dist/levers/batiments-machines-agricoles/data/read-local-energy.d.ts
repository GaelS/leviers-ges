import { Result } from 'neverthrow';
import { type DataSource, type DataSourceError } from '../../../domain/data-source.ts';
import type { Level, Territory } from '../../../domain/territory.ts';
import type { AgriculturalConsumption } from './agricultural-consumption.ts';
import { type RegionalEnergy } from './read-regional-energy.ts';
type LocalEnergy = Pick<AgriculturalConsumption, 'electricity' | 'naturalGas'>;
declare function readLocalEnergy({ dataSource, territory, regionalEnergy, }: {
    dataSource: DataSource;
    territory: Territory<Level>;
    regionalEnergy: RegionalEnergy;
}): Result<LocalEnergy, DataSourceError>;
export { readLocalEnergy };
