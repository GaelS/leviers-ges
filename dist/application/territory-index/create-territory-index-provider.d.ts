import { type Result } from 'neverthrow';
import type { DataSource, DataSourceError } from '../../domain/data-source.ts';
import type { TerritoryIndex } from '../../domain/territory-index.ts';
declare function createTerritoryIndexProvider(dataSource: DataSource): () => Result<TerritoryIndex, DataSourceError>;
export { createTerritoryIndexProvider };
