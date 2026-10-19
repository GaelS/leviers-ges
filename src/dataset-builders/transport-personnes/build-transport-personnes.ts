import type BigNumber from 'bignumber.js'
import { groupBy } from 'es-toolkit'
import { Result, err, ok } from 'neverthrow'
import { sum } from '../../domain/big-number.ts'
import { invalidDataset, type InvalidDataset } from '../../domain/data-source.ts'
import { roundToLoaderPrecision } from '../round-to-loader-precision.ts'
import { toCsvText } from '../to-csv-text.ts'
import {
  calculateFleetEmissionFactor,
  type FleetCounts,
  type FleetEmissionFactor,
} from './calculate-fleet-emission-factor.ts'
import {
  calculateTerritoryPassengerKm,
  type TerritoryPassengerKm,
} from './calculate-territory-passenger-km.ts'
import {
  BUS_EMISSION_FACTORS_KG_PER_KM,
  CAR_EMISSION_FACTORS_KG_PER_KM,
} from './fleet-emission-factors.ts'
import { readCommutingPassengerKm } from './read-commuting-passenger-km.ts'
import { readFleet, type FleetGroup, type FleetRow } from './read-fleet.ts'
import type { TransportSources } from './read-transport-sources.ts'
import type { SourceLevel } from './source-level.ts'

// Source : data/transport-personnes/manifest.json, colonnes numériques de regions.csv, departements.csv et epcis.csv
const NUMERIC_COLUMNS = [
  'car_weekly_passenger_km',
  'public_transport_weekly_passenger_km',
  'car_emission_factor_kg_per_km',
  'bus_emission_factor_kg_per_km',
  'car_fleet_unclassified_share',
  'bus_fleet_unclassified_share',
  'bus_fleet_classified',
] as const

type NumericColumn = (typeof NUMERIC_COLUMNS)[number]

type ControlTotals = {
  readonly car_weekly_passenger_km: string
  readonly public_transport_weekly_passenger_km: string
}

type LevelBuild = {
  readonly csv: string
  readonly territoryCount: number
  readonly controlTotals: ControlTotals
}

type TransportBuild = {
  readonly regions: LevelBuild
  readonly departements: LevelBuild
  readonly epcis: LevelBuild
}

type NationalFactors = {
  readonly car: BigNumber
  readonly bus: BigNumber
}

const outputDataset = 'transport-personnes'

function fleetCountsOf({
  fleetByTerritory,
  level,
  code,
  group,
}: {
  fleetByTerritory: Readonly<Record<string, readonly FleetRow[]>>
  level: SourceLevel
  code: string
  group: FleetGroup
}): FleetCounts {
  const rows = fleetByTerritory[`${level}|${code}|${group}`] ?? []
  return Object.fromEntries(rows.map(({ fuel, vehicles }) => [fuel, vehicles]))
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
    Object.entries(byFuel).map(([fuel, rows]) => [
      fuel,
      sum(rows.map(({ vehicles }) => vehicles)),
    ]),
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
    ? err(invalidDataset({ dataset: outputDataset, reason: 'empty_dataset', detail: `national ${group} fleet` }))
    : ok(factor.emissionFactor)
}

function calculateNationalFactors(fleet: readonly FleetRow[]): Result<NationalFactors, InvalidDataset> {
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

function toRoundedFields(
  values: Readonly<Record<NumericColumn, BigNumber>>,
): Result<readonly string[], InvalidDataset> {
  return Result.combine(
    NUMERIC_COLUMNS.map((column) =>
      roundToLoaderPrecision({ dataset: outputDataset, column, text: values[column].toFixed() }),
    ),
  )
}

function toTerritoryRow({
  territory,
  fleetByTerritory,
  national,
}: {
  territory: TerritoryPassengerKm
  fleetByTerritory: Readonly<Record<string, readonly FleetRow[]>>
  national: NationalFactors
}): Result<readonly string[], InvalidDataset> {
  const { level, code } = territory
  const car = calculateFleetEmissionFactor({
    counts: fleetCountsOf({ fleetByTerritory, level, code, group: 'VP' }),
    emissionFactors: CAR_EMISSION_FACTORS_KG_PER_KM,
  })
  const bus = calculateFleetEmissionFactor({
    counts: fleetCountsOf({ fleetByTerritory, level, code, group: 'TC_routier' }),
    emissionFactors: BUS_EMISSION_FACTORS_KG_PER_KM,
  })
  return toRoundedFields({
    car_weekly_passenger_km: territory.carWeeklyPassengerKm,
    public_transport_weekly_passenger_km: territory.publicTransportWeeklyPassengerKm,
    car_emission_factor_kg_per_km: car.emissionFactor ?? national.car,
    bus_emission_factor_kg_per_km: bus.emissionFactor ?? national.bus,
    car_fleet_unclassified_share: car.unclassifiedShare,
    bus_fleet_unclassified_share: bus.unclassifiedShare,
    bus_fleet_classified: bus.classifiedVehicles,
  }).map((fields) => [code, ...fields])
}

function toControlTotals(territories: readonly TerritoryPassengerKm[]): ControlTotals {
  return {
    car_weekly_passenger_km: sum(territories.map(({ carWeeklyPassengerKm }) => carWeeklyPassengerKm)).toFixed(),
    public_transport_weekly_passenger_km: sum(
      territories.map(({ publicTransportWeeklyPassengerKm }) => publicTransportWeeklyPassengerKm),
    ).toFixed(),
  }
}

function buildLevel({
  territories,
  keyColumn,
  fleetByTerritory,
  national,
}: {
  territories: readonly TerritoryPassengerKm[]
  keyColumn: string
  fleetByTerritory: Readonly<Record<string, readonly FleetRow[]>>
  national: NationalFactors
}): Result<LevelBuild, InvalidDataset> {
  return Result.combine(
    territories.map((territory) => toTerritoryRow({ territory, fleetByTerritory, national })),
  ).andThen((rows) =>
    toCsvText({ dataset: outputDataset, columns: [keyColumn, ...NUMERIC_COLUMNS], rows }).map((csv) => ({
      csv,
      territoryCount: rows.length,
      controlTotals: toControlTotals(territories),
    })),
  )
}

function buildLevels({
  passengerKm,
  fleet,
  national,
}: {
  passengerKm: readonly TerritoryPassengerKm[]
  fleet: readonly FleetRow[]
  national: NationalFactors
}): Result<TransportBuild, InvalidDataset> {
  const fleetByTerritory = groupBy(fleet, ({ level, code, group }) => `${level}|${code}|${group}`)
  const buildSourceLevel = ({ level, keyColumn }: { level: SourceLevel; keyColumn: string }) =>
    buildLevel({
      territories: passengerKm.filter((territory) => territory.level === level),
      keyColumn,
      fleetByTerritory,
      national,
    })
  return Result.combine([
    buildSourceLevel({ level: 'REG', keyColumn: 'code_region' }),
    buildSourceLevel({ level: 'DEP', keyColumn: 'code_departement' }),
    buildSourceLevel({ level: 'EPCI', keyColumn: 'code_epci' }),
  ]).map(([regions, departements, epcis]) => ({ regions, departements, epcis }))
}

function buildTransportPersonnes({
  commutingCsv,
  fleetCsv,
}: TransportSources): Result<TransportBuild, InvalidDataset> {
  return Result.combine([readCommutingPassengerKm(commutingCsv), readFleet(fleetCsv)]).andThen(
    ([commuting, fleet]) =>
      calculateNationalFactors(fleet).andThen((national) =>
        buildLevels({ passengerKm: calculateTerritoryPassengerKm(commuting), fleet, national }),
      ),
  )
}

export { buildTransportPersonnes }
export type { TransportBuild }
