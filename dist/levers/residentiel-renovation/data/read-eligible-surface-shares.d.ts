import { Result } from 'neverthrow';
import type { DepartementLookup } from '../../../application/estimate/estimation-context.ts';
import { type DataSource, type DataSourceError } from '../../../domain/data-source.ts';
import type { ResidentialEnergyVector } from '../../../domain/residential-heating-shares.ts';
import type { Level, Territory } from '../../../domain/territory.ts';
import { type Fraction } from '../../../domain/units.ts';
declare function readEligibleSurfaceShares({ dataSource, territory, communes, getDepartementByCommune, }: {
    dataSource: DataSource;
    territory: Territory<Level>;
    communes: readonly string[];
    getDepartementByCommune: DepartementLookup;
}): Result<Readonly<Record<ResidentialEnergyVector, Fraction>>, DataSourceError>;
export { readEligibleSurfaceShares };
