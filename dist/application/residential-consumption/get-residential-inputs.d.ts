import type { Result } from 'neverthrow';
import type { DataSource, DataSourceError } from '../../domain/data-source.ts';
import type { Level, Territory } from '../../domain/territory.ts';
import type { KgCo2ePerKwh } from '../../domain/units.ts';
import type { ResidentialConsumption } from '../../domain/residential-consumption.ts';
type ResidentialInputs = {
    readonly consumption: ResidentialConsumption;
    readonly heatEmissionFactor: KgCo2ePerKwh;
};
declare function getResidentialInputs({ dataSource, territory, communes, }: {
    dataSource: DataSource;
    territory: Territory<Level>;
    communes: readonly string[];
}): Result<ResidentialInputs, DataSourceError>;
export { getResidentialInputs };
