import { createTerritoryIndexProvider } from '../application/territory-index/create-territory-index-provider.ts'
import type { EstimationContext } from '../application/estimate/estimation-context.ts'
import type { DataSource } from '../domain/data-source.ts'

function estimationContextOf(dataSource: DataSource): EstimationContext {
  return { dataSource, territoryIndex: createTerritoryIndexProvider(dataSource) }
}

export { estimationContextOf }
