import { Result } from 'neverthrow';
import { requireColumn, requireQuantityColumn } from "../require-column.js";
const reseauxChaleurNetworksDataset = 'reseaux-chaleur/networks';
function toHeatNetwork({ dataset, row, }) {
    return Result.combine([
        requireQuantityColumn({ dataset, row, column: 'delivered_mwh' }),
        requireQuantityColumn({ dataset, row, column: 'emission_factor_kg_per_kwh' }),
    ]).map(([deliveredMwh, emissionFactor]) => ({ deliveredMwh, emissionFactor }));
}
function keepHeatNetworksInCommunes({ dataset, communes, rows, }) {
    return Result.combine(rows.map((row) => requireColumn({ dataset, row, column: 'commune_code' }).map((commune) => ({
        row,
        commune,
    }))))
        .map((located) => located.filter(({ commune }) => communes.has(commune)).map(({ row }) => row))
        .andThen((rowsInside) => Result.combine(rowsInside.map((row) => toHeatNetwork({ dataset, row }))));
}
function readHeatNetworks({ dataSource, dataset, communes, }) {
    return dataSource
        .rows(dataset)
        .andThen((rows) => keepHeatNetworksInCommunes({ dataset, communes: new Set(communes), rows }));
}
export { readHeatNetworks, reseauxChaleurNetworksDataset };
//# sourceMappingURL=read-heat-networks.js.map