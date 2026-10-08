import type { Result } from 'neverthrow'
import type { DataSource, DataSourceError } from '../../domain/data-source.ts'
import type { Level, Territory } from '../../domain/territory.ts'
import type { UnknownTerritory } from '../../domain/territory-index.ts'

type EstimationContext = {
  readonly dataSource: DataSource
  readonly getCommunesOf: (
    territory: Territory<Level>,
  ) => Result<readonly string[], DataSourceError | UnknownTerritory>
}

export type { EstimationContext }
