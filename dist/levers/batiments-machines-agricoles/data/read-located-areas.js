import { Result } from 'neverthrow';
import { memoizeOkByReferences } from "../../../application/memoize-ok-by-references.js";
import { requireNonEmptyColumn, requireQuantityColumn } from "../../../application/require-column.js";
const areasDataset = 'surface-agricole-utile/communes';
function hasRegion(area) {
    return area.region !== undefined;
}
function toLocatableArea({ row, getRegionByCommune, }) {
    const dataset = areasDataset;
    return Result.combine([
        requireNonEmptyColumn({ dataset, row, column: 'code_commune' }),
        requireQuantityColumn({ dataset, row, column: 'agricultural_area_ha' }),
    ]).andThen(([commune, hectares]) => getRegionByCommune(commune).map((region) => ({ commune, region, hectares })));
}
const locateAreas = memoizeOkByReferences((dataSource, getRegionByCommune) => dataSource
    .rows(areasDataset)
    .andThen((rows) => Result.combine(rows.map((row) => toLocatableArea({ row, getRegionByCommune }))))
    .map((areas) => areas.filter(hasRegion)));
function readLocatedAreas({ dataSource, getRegionByCommune, }) {
    return locateAreas(dataSource, getRegionByCommune);
}
export { readLocatedAreas };
//# sourceMappingURL=read-located-areas.js.map