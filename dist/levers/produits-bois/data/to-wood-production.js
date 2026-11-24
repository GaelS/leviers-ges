import { Result } from 'neverthrow';
import { requireQuantityColumn } from "../../../application/require-column.js";
function toWoodProduction({ dataset, row, }) {
    return Result.combine([
        requireQuantityColumn({
            dataset,
            row,
            column: 'logs_thousand_m3',
        }),
        requireQuantityColumn({
            dataset,
            row,
            column: 'industrial_wood_thousand_m3',
        }),
    ]).map(([logs, industrialWood]) => ({ logs, industrialWood }));
}
export { toWoodProduction };
//# sourceMappingURL=to-wood-production.js.map