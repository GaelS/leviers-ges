import { Result } from 'neverthrow';
import { requireQuantityColumn } from "../../require-column.js";
import { readTransportRow } from "./read-transport-row.js";
function toTransportInputs({ dataset, row, }) {
    return Result.combine([
        requireQuantityColumn({
            dataset,
            row,
            column: 'car_weekly_passenger_km',
        }),
        requireQuantityColumn({
            dataset,
            row,
            column: 'public_transport_weekly_passenger_km',
        }),
        requireQuantityColumn({
            dataset,
            row,
            column: 'car_emission_factor_kg_per_km',
        }),
        requireQuantityColumn({
            dataset,
            row,
            column: 'bus_emission_factor_kg_per_km',
        }),
        requireQuantityColumn({ dataset, row, column: 'car_fleet_unclassified_share' }),
        requireQuantityColumn({ dataset, row, column: 'bus_fleet_unclassified_share' }),
        requireQuantityColumn({ dataset, row, column: 'car_fleet_classified' }),
        requireQuantityColumn({ dataset, row, column: 'bus_fleet_classified' }),
    ]).map(([carWeeklyPassengerKm, publicTransportWeeklyPassengerKm, carEmissionFactor, busEmissionFactor, carFleetUnclassifiedShare, busFleetUnclassifiedShare, carFleetClassified, busFleetClassified,]) => ({
        carWeeklyPassengerKm,
        publicTransportWeeklyPassengerKm,
        carEmissionFactor,
        busEmissionFactor,
        carFleetUnclassifiedShare,
        busFleetUnclassifiedShare,
        carFleetClassified,
        busFleetClassified,
    }));
}
function readTransportInputs({ dataSource, territory, }) {
    return readTransportRow({ dataSource, territory }).andThen(({ dataset, row }) => toTransportInputs({ dataset, row }));
}
export { readTransportInputs };
//# sourceMappingURL=read-transport-inputs.js.map