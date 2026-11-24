import { Result } from 'neverthrow';
import type { DepartementLookup } from '../../../application/estimate/estimation-context.ts';
import type { DataSource, DataSourceError } from '../../../domain/data-source.ts';
import type { Hectares } from '../../../domain/units.ts';
type LocatedArea = {
    readonly commune: string;
    readonly departement: string;
    readonly hectares: Hectares;
};
declare function readLocatedAreas({ dataSource, getDepartementByCommune, }: {
    dataSource: DataSource;
    getDepartementByCommune: DepartementLookup;
}): Result<readonly LocatedArea[], DataSourceError>;
export { readLocatedAreas };
export type { LocatedArea };
