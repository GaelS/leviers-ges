import { err, ok, Result } from 'neverthrow';
import { missingData, } from "../../../domain/data-source.js";
import { gigawattHoursToMegawattHours } from "../../../domain/units.js";
import { requireNonEmptyColumn, requireQuantityColumn } from "../../../application/require-column.js";
const regionsDataset = 'batiments-machines-agricoles/regions';
function toRegionalEntry(row) {
    const dataset = regionsDataset;
    return Result.combine([
        requireNonEmptyColumn({ dataset, row, column: 'code_region' }),
        requireQuantityColumn({ dataset, row, column: 'electricity_gwh' }),
        requireQuantityColumn({ dataset, row, column: 'natural_gas_gwh' }),
        requireQuantityColumn({ dataset, row, column: 'petroleum_products_gwh' }),
        requireQuantityColumn({ dataset, row, column: 'heat_gwh' }),
    ]).map(([region, electricity, naturalGas, petroleumProducts, heat]) => [
        region,
        {
            electricity: gigawattHoursToMegawattHours(electricity),
            naturalGas: gigawattHoursToMegawattHours(naturalGas),
            petroleumProducts: gigawattHoursToMegawattHours(petroleumProducts),
            heat: gigawattHoursToMegawattHours(heat),
        },
    ]);
}
function readRegionalEnergy(dataSource) {
    return dataSource
        .rows(regionsDataset)
        .andThen((rows) => Result.combine(rows.map(toRegionalEntry)))
        .map((entries) => new Map(entries));
}
function findRegionalConsumption({ regionalEnergy, region, }) {
    const consumption = regionalEnergy.get(region);
    return consumption === undefined
        ? err(missingData({ dataset: regionsDataset, key: region }))
        : ok(consumption);
}
export { findRegionalConsumption, readRegionalEnergy };
//# sourceMappingURL=read-regional-energy.js.map