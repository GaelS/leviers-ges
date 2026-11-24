import { Result } from 'neverthrow';
import type { DataSource, DataSourceError } from '../../domain/data-source.ts';
import { type TerritoryIndex } from '../../domain/territory-index.ts';
declare function loadTerritoryIndex(dataSource: DataSource): Result<TerritoryIndex, DataSourceError>;
export { loadTerritoryIndex };
