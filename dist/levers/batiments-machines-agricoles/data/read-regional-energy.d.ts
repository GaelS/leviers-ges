import { Result } from 'neverthrow';
import { type DataSource, type DataSourceError, type MissingData } from '../../../domain/data-source.ts';
import type { AgriculturalConsumption } from './agricultural-consumption.ts';
type RegionalEnergy = ReadonlyMap<string, AgriculturalConsumption>;
declare function readRegionalEnergy(dataSource: DataSource): Result<RegionalEnergy, DataSourceError>;
declare function findRegionalConsumption({ regionalEnergy, region, }: {
    regionalEnergy: RegionalEnergy;
    region: string;
}): Result<AgriculturalConsumption, MissingData>;
export { findRegionalConsumption, readRegionalEnergy };
export type { RegionalEnergy };
