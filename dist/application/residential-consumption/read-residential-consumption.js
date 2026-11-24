import { Result } from 'neverthrow';
import { match } from 'ts-pattern';
import { requireQuantityColumn } from "../require-column.js";
import { sum } from "../../domain/big-number.js";
import { gigawattHoursToMegawattHours, quantity } from "../../domain/units.js";
import { readEpciConsumption } from "./read-epci-consumption.js";
const regionsDataset = 'residentiel-sobriete/regions';
const departementsDataset = 'residentiel-sobriete/departements';
function toRegionalConsumption(row) {
    const dataset = regionsDataset;
    return Result.combine([
        requireQuantityColumn({ dataset, row, column: 'electricity_gwh' }),
        requireQuantityColumn({ dataset, row, column: 'natural_gas_gwh' }),
        requireQuantityColumn({ dataset, row, column: 'fuel_oil_gwh' }),
        requireQuantityColumn({ dataset, row, column: 'lpg_gwh' }),
        requireQuantityColumn({ dataset, row, column: 'heat_gwh' }),
    ]).map(([electricity, naturalGas, fuelOil, liquefiedPetroleumGas, heat]) => ({
        electricity: gigawattHoursToMegawattHours(electricity),
        naturalGas: gigawattHoursToMegawattHours(naturalGas),
        fuelOil: gigawattHoursToMegawattHours(fuelOil),
        liquefiedPetroleumGas: gigawattHoursToMegawattHours(liquefiedPetroleumGas),
        heat: gigawattHoursToMegawattHours(heat),
    }));
}
function toDepartmentConsumption({ row, networks, }) {
    const dataset = departementsDataset;
    const heat = quantity(sum(networks.map(({ deliveredMwh }) => deliveredMwh)).toFixed());
    return Result.combine([
        requireQuantityColumn({ dataset, row, column: 'electricity_mwh' }),
        requireQuantityColumn({ dataset, row, column: 'natural_gas_mwh' }),
        requireQuantityColumn({ dataset, row, column: 'fuel_oil_mwh' }),
        requireQuantityColumn({ dataset, row, column: 'lpg_mwh' }),
    ]).map(([electricity, naturalGas, fuelOil, liquefiedPetroleumGas]) => ({
        electricity,
        naturalGas,
        fuelOil,
        liquefiedPetroleumGas,
        heat,
    }));
}
function readResidentialConsumption({ dataSource, territory, networks, }) {
    return match(territory)
        .with({ level: 'region' }, () => dataSource.row(regionsDataset, territory).andThen(toRegionalConsumption))
        .with({ level: 'departement' }, () => dataSource
        .row(departementsDataset, territory)
        .andThen((row) => toDepartmentConsumption({ row, networks })))
        .with({ level: 'epci' }, (epci) => readEpciConsumption({ dataSource, territory: epci, networks }))
        .exhaustive();
}
export { readResidentialConsumption };
//# sourceMappingURL=read-residential-consumption.js.map