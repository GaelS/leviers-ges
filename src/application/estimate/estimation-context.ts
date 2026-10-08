import type { Result } from 'neverthrow'
import type { DataSource, DataSourceError } from '../../domain/data-source.ts'
import type { TerritoryIndex } from '../../domain/territory-index.ts'

type EstimationContext = {
  readonly dataSource: DataSource
  readonly territoryIndex: () => Result<TerritoryIndex, DataSourceError>
}

export type { EstimationContext }
