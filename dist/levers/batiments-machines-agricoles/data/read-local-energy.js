import { Result } from 'neverthrow';
import { match } from 'ts-pattern';
import {} from "../../../domain/data-source.js";
import { requireQuantityColumn } from "../../../application/require-column.js";
import { findRegionalConsumption } from "./read-regional-energy.js";
const departementsDataset = 'batiments-machines-agricoles/departements';
const epcisDataset = 'batiments-machines-agricoles/epcis';
function toLocalEnergy({ dataset, row, }) {
    return Result.combine([
        requireQuantityColumn({ dataset, row, column: 'electricity_mwh' }),
        requireQuantityColumn({ dataset, row, column: 'natural_gas_mwh' }),
    ]).map(([electricity, naturalGas]) => ({ electricity, naturalGas }));
}
function readLocalEnergy({ dataSource, territory, regionalEnergy, }) {
    function readRow(dataset) {
        return dataSource.row(dataset, territory).andThen((row) => toLocalEnergy({ dataset, row }));
    }
    return match(territory.level)
        .with('region', () => findRegionalConsumption({ regionalEnergy, region: territory.code }).map(({ electricity, naturalGas }) => ({ electricity, naturalGas })))
        .with('departement', () => readRow(departementsDataset))
        .with('epci', () => readRow(epcisDataset))
        .exhaustive();
}
export { readLocalEnergy };
//# sourceMappingURL=read-local-energy.js.map