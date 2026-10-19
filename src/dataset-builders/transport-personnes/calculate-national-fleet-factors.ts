import type BigNumber from 'bignumber.js'
import { groupBy } from 'es-toolkit'
import { Result, err, ok } from 'neverthrow'
import { sum } from '../../domain/big-number.ts'
import { invalidDataset, type InvalidDataset } from '../../domain/data-source.ts'
import {
  calculateFleetEmissionFactor,
  type FleetCounts,
  type FleetEmissionFactor,
} from './calculate-fleet-emission-factor.ts'
import {
  BUS_EMISSION_FACTORS_KG_PER_KM,
  CAR_EMISSION_FACTORS_KG_PER_KM,
} from './fleet-emission-factors.ts'
import { fleetDataset, type FleetGroup, type FleetRow } from './read-fleet.ts'

type NationalFleetFactors = {
  readonly car: BigNumber
  readonly bus: BigNumber
}

function nationalCountsOf({
  fleet,
  group,
}: {
  fleet: readonly FleetRow[]
  group: FleetGroup
}): FleetCounts {
  const regional = fleet.filter((row) => row.level === 'REG' && row.group === group)
  const byFuel = groupBy(regional, ({ fuel }) => fuel)
  return Object.fromEntries(
    Object.entries(byFuel).map(([fuel, rows]) => [fuel, sum(rows.map(({ vehicles }) => vehicles))]),
  )
}

function requireEmissionFactor({
  factor,
  group,
}: {
  factor: FleetEmissionFactor
  group: FleetGroup
}): Result<BigNumber, InvalidDataset> {
  return factor.emissionFactor === undefined
    ? err(
        invalidDataset({
          dataset: fleetDataset,
          reason: 'empty_dataset',
          detail: `national ${group} fleet`,
        }),
      )
    : ok(factor.emissionFactor)
}

function calculateNationalFleetFactors(
  fleet: readonly FleetRow[],
): Result<NationalFleetFactors, InvalidDataset> {
  const car = calculateFleetEmissionFactor({
    counts: nationalCountsOf({ fleet, group: 'VP' }),
    emissionFactors: CAR_EMISSION_FACTORS_KG_PER_KM,
  })
  const bus = calculateFleetEmissionFactor({
    counts: nationalCountsOf({ fleet, group: 'TC_routier' }),
    emissionFactors: BUS_EMISSION_FACTORS_KG_PER_KM,
  })
  return Result.combine([
    requireEmissionFactor({ factor: car, group: 'VP' }),
    requireEmissionFactor({ factor: bus, group: 'TC_routier' }),
  ]).map(([carFactor, busFactor]) => ({ car: carFactor, bus: busFactor }))
}

export { calculateNationalFleetFactors }
export type { NationalFleetFactors }
