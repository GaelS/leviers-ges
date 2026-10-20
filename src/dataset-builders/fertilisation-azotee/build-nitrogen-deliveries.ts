import { Result } from 'neverthrow'
import type { InvalidDataset } from '../../domain/data-source.ts'
import {
  buildDepartementDeliveries,
  type DepartementDeliveries,
} from './build-departement-deliveries.ts'
import { buildRegionDeliveries, type RegionDeliveries } from './build-region-deliveries.ts'

type NitrogenDeliveries = {
  readonly regions: RegionDeliveries
  readonly departements: DepartementDeliveries
}

function buildNitrogenDeliveries({
  regionDeliveriesCsv,
  departementDeliveriesCsv,
}: {
  regionDeliveriesCsv: string
  departementDeliveriesCsv: string
}): Result<NitrogenDeliveries, InvalidDataset> {
  return Result.combine([
    buildRegionDeliveries(regionDeliveriesCsv),
    buildDepartementDeliveries(departementDeliveriesCsv),
  ]).map(([regions, departements]) => ({ regions, departements }))
}

export { buildNitrogenDeliveries }
