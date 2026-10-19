import { Result } from 'neverthrow'
import type { RailEmissionFactor } from '../../../application/data/transport-personnes/rail-emission-factor.ts'
import { readTransportInputs } from '../../../application/data/transport-personnes/read-transport-inputs.ts'
import { resolveRailEmissionFactor } from '../../../application/data/transport-personnes/resolve-rail-emission-factor.ts'
import {
  resolveRailShare,
  type RailShare,
} from '../../../application/data/transport-personnes/resolve-rail-share.ts'
import type { TransportInputs } from '../../../application/data/transport-personnes/transport-inputs.ts'
import type { RegionLookup } from '../../../application/estimate/estimation-context.ts'
import type { DataSource, DataSourceError } from '../../../domain/data-source.ts'
import type { ComputedLevels } from '../../../domain/lever-registry.ts'
import type { Territory } from '../../../domain/territory.ts'
import type { Fraction } from '../../../domain/units.ts'

type SobrieteInputs = {
  readonly transportInputs: TransportInputs
  readonly railShare: RailShare
  readonly railEmissionFactor: RailEmissionFactor
}

function getSobrieteInputs({
  dataSource,
  territory,
  communes,
  requestedRailShare,
  getRegionByCommune,
}: {
  dataSource: DataSource
  territory: Territory<ComputedLevels<'transport_personnes_sobriete_deplacements'>>
  communes: readonly string[]
  requestedRailShare: Fraction | undefined
  getRegionByCommune: RegionLookup
}): Result<SobrieteInputs, DataSourceError> {
  return Result.combine([
    readTransportInputs({ dataSource, territory }),
    resolveRailShare({ requested: requestedRailShare, communes, getRegionByCommune }),
    resolveRailEmissionFactor({ communes, getRegionByCommune }),
  ]).map(([transportInputs, railShare, railEmissionFactor]) => ({
    transportInputs,
    railShare,
    railEmissionFactor,
  }))
}

export { getSobrieteInputs }
