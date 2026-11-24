import { Result } from 'neverthrow';
import { readTransportRow } from "../../../application/data/transport-personnes/read-transport-row.js";
import { requireQuantityColumn } from "../../../application/require-column.js";
function readThermalFleet({ dataSource, territory, }) {
    return readTransportRow({ dataSource, territory }).andThen(({ dataset, row }) => Result.combine([
        requireQuantityColumn({
            dataset,
            row,
            column: 'car_thermal_emission_factor_kg_per_km',
        }),
        requireQuantityColumn({
            dataset,
            row,
            column: 'bus_thermal_emission_factor_kg_per_km',
        }),
        requireQuantityColumn({ dataset, row, column: 'car_thermal_fleet_share' }),
        requireQuantityColumn({ dataset, row, column: 'bus_thermal_fleet_share' }),
    ]).map(([carThermalEmissionFactor, busThermalEmissionFactor, carThermalFleetShare, busThermalFleetShare,]) => ({
        carThermalEmissionFactor,
        busThermalEmissionFactor,
        carThermalFleetShare,
        busThermalFleetShare,
    })));
}
export { readThermalFleet };
//# sourceMappingURL=read-thermal-fleet.js.map