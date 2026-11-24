import { Result } from 'neverthrow';
import type { DepartementLookup, EstimationContext } from '../../../application/estimate/estimation-context.ts';
import { type DataSource, type DataSourceError } from '../../../domain/data-source.ts';
import type { Territory } from '../../../domain/territory.ts';
import type { UnknownTerritory } from '../../../domain/territory-index.ts';
import type { EpciNitrogenPart } from './epci-nitrogen-part.ts';
declare function readEpciNitrogenParts({ dataSource, territory, getCommunesOf, getDepartementByCommune, }: {
    dataSource: DataSource;
    territory: Territory<'epci'>;
    getCommunesOf: EstimationContext['getCommunesOf'];
    getDepartementByCommune: DepartementLookup;
}): Result<readonly EpciNitrogenPart[], DataSourceError | UnknownTerritory>;
export { readEpciNitrogenParts };
