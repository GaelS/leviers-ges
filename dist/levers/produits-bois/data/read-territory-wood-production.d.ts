import type { Result } from 'neverthrow';
import type { DataSource, DataSourceError } from '../../../domain/data-source.ts';
import type { ComputedLevels } from '../../../domain/lever-registry.ts';
import type { Territory } from '../../../domain/territory.ts';
import type { WoodProduction } from './wood-production.ts';
declare function readTerritoryWoodProduction({ dataSource, territory, }: {
    dataSource: DataSource;
    territory: Territory<ComputedLevels<'produits_bois'>>;
}): Result<WoodProduction, DataSourceError>;
export { readTerritoryWoodProduction };
