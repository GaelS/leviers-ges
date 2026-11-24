import { Result } from 'neverthrow';
import { memoizeOkByReferences } from "../../../application/memoize-ok-by-references.js";
import { requireNonEmptyColumn, requireQuantityColumn } from "../../../application/require-column.js";
const agriculturalAreaDataset = 'surface-agricole-utile/communes';
function toLocatedArea({ row, getDepartementByCommune, }) {
    const dataset = agriculturalAreaDataset;
    return Result.combine([
        requireNonEmptyColumn({ dataset, row, column: 'code_commune' }),
        requireQuantityColumn({ dataset, row, column: 'agricultural_area_ha' }),
    ]).andThen(([commune, hectares]) => getDepartementByCommune(commune).map((departement) => departement === undefined ? [] : [{ commune, departement, hectares }]));
}
const locateAreas = memoizeOkByReferences((dataSource, getDepartementByCommune) => dataSource
    .rows(agriculturalAreaDataset)
    .andThen((rows) => Result.combine(rows.map((row) => toLocatedArea({ row, getDepartementByCommune }))))
    .map((located) => located.flat()));
function readLocatedAreas({ dataSource, getDepartementByCommune, }) {
    return locateAreas(dataSource, getDepartementByCommune);
}
export { readLocatedAreas };
//# sourceMappingURL=read-located-areas.js.map