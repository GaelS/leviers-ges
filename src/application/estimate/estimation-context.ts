import type { Result } from 'neverthrow'
import type { DataSource, DataSourceError } from '../../domain/data-source.js'
import type { TerritoryIndex } from '../../domain/territory-index.js'

type EstimationContext = {
  readonly dataSource: DataSource
  readonly territoryIndex: () => Result<TerritoryIndex, DataSourceError>
}

export type { EstimationContext }
