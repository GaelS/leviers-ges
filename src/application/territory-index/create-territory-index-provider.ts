import { ok, type Result } from 'neverthrow'
import type { DataSource, DataSourceError } from '../../domain/data-source.js'
import type { TerritoryIndex } from '../../domain/territory-index.js'
import { loadTerritoryIndex } from './load-territory-index.js'

function createTerritoryIndexProvider(
  dataSource: DataSource,
): () => Result<TerritoryIndex, DataSourceError> {
  let builtIndex: TerritoryIndex | undefined

  return () => {
    if (builtIndex !== undefined) return ok(builtIndex)
    return loadTerritoryIndex(dataSource).map((index) => {
      builtIndex = index
      return index
    })
  }
}

export { createTerritoryIndexProvider }
