import { err, ok } from 'neverthrow';
import { parseBig } from "../domain/big-number.js";
import { invalidDataset } from "../domain/data-source.js";
import { quantity } from "../domain/units.js";
function requireColumn({ dataset, row, column }) {
    const value = row[column];
    return value === undefined
        ? err(invalidDataset({ dataset, reason: 'columns_mismatch', detail: column }))
        : ok(value);
}
function requireNonEmptyColumn(reference) {
    return requireColumn(reference).andThen((value) => value.trim() === ''
        ? err(invalidDataset({ dataset: reference.dataset, reason: 'empty_key', detail: reference.column }))
        : ok(value));
}
function requireQuantityColumn(reference) {
    return requireColumn(reference).andThen((value) => parseBig(value).isOk()
        ? ok(quantity(value))
        : err(invalidDataset({
            dataset: reference.dataset,
            reason: 'unreadable',
            detail: `${reference.column}=${value} is not a decimal number`,
        })));
}
function requireOptionalQuantityColumn(reference) {
    return requireColumn(reference).andThen((value) => value === '' ? ok(undefined) : requireQuantityColumn(reference));
}
export { requireColumn, requireNonEmptyColumn, requireOptionalQuantityColumn, requireQuantityColumn };
//# sourceMappingURL=require-column.js.map