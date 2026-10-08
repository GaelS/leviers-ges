import { createTerritoryIndexProvider } from '../application/territory-index/create-territory-index-provider.js'
import type { EstimationContext } from '../application/estimate/estimation-context.js'
import type { DataSource } from '../domain/data-source.js'

function estimationContextOf(dataSource: DataSource): EstimationContext {
  return { dataSource, territoryIndex: createTerritoryIndexProvider(dataSource) }
}

export { estimationContextOf }
