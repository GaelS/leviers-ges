import { Result } from 'neverthrow'
import { match } from 'ts-pattern'
import { requireQuantityColumn } from '../../require-column.ts'
import type {
  DataRow,
  DataSource,
  DataSourceError,
  InvalidDataset,
} from '../../../domain/data-source.ts'
import type { Level, Territory } from '../../../domain/territory.ts'
import type { TransportInputs } from './transport-inputs.ts'

const regionsDataset = 'transport-personnes/regions'

const departementsDataset = 'transport-personnes/departements'

const epcisDataset = 'transport-personnes/epcis'

function toTransportInputs({
  dataset,
  row,
}: {
  dataset: string
  row: DataRow
}): Result<TransportInputs, InvalidDataset> {
  return Result.combine([
    requireQuantityColumn<'PassengerKilometresPerWeek'>({
      dataset,
      row,
      column: 'car_weekly_passenger_km',
    }),
    requireQuantityColumn<'PassengerKilometresPerWeek'>({
      dataset,
      row,
      column: 'public_transport_weekly_passenger_km',
    }),
    requireQuantityColumn<'KgCo2ePerVehicleKilometre'>({
      dataset,
      row,
      column: 'car_emission_factor_kg_per_km',
    }),
    requireQuantityColumn<'KgCo2ePerVehicleKilometre'>({
      dataset,
      row,
      column: 'bus_emission_factor_kg_per_km',
    }),
    requireQuantityColumn<'Fraction'>({ dataset, row, column: 'car_fleet_unclassified_share' }),
    requireQuantityColumn<'Fraction'>({ dataset, row, column: 'bus_fleet_unclassified_share' }),
    requireQuantityColumn<'Vehicles'>({ dataset, row, column: 'car_fleet_classified' }),
    requireQuantityColumn<'Vehicles'>({ dataset, row, column: 'bus_fleet_classified' }),
  ]).map(
    ([
      carWeeklyPassengerKm,
      publicTransportWeeklyPassengerKm,
      carEmissionFactor,
      busEmissionFactor,
      carFleetUnclassifiedShare,
      busFleetUnclassifiedShare,
      carFleetClassified,
      busFleetClassified,
    ]) => ({
      carWeeklyPassengerKm,
      publicTransportWeeklyPassengerKm,
      carEmissionFactor,
      busEmissionFactor,
      carFleetUnclassifiedShare,
      busFleetUnclassifiedShare,
      carFleetClassified,
      busFleetClassified,
    }),
  )
}

function readTransportInputs({
  dataSource,
  territory,
}: {
  dataSource: DataSource
  territory: Territory<Level>
}): Result<TransportInputs, DataSourceError> {
  return match(territory.level)
    .with('region', () =>
      dataSource
        .row(regionsDataset, territory)
        .andThen((row) => toTransportInputs({ dataset: regionsDataset, row })),
    )
    .with('departement', () =>
      dataSource
        .row(departementsDataset, territory)
        .andThen((row) => toTransportInputs({ dataset: departementsDataset, row })),
    )
    .with('epci', () =>
      dataSource
        .row(epcisDataset, territory)
        .andThen((row) => toTransportInputs({ dataset: epcisDataset, row })),
    )
    .exhaustive()
}

export { readTransportInputs }
