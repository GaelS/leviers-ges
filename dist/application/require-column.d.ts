import { type Result } from 'neverthrow';
import { type DataRow, type InvalidDataset } from '../domain/data-source.ts';
import { type Quantity, type UnitName } from '../domain/units.ts';
type ColumnReference = {
    readonly dataset: string;
    readonly row: DataRow;
    readonly column: string;
};
declare function requireColumn({ dataset, row, column }: ColumnReference): Result<string, InvalidDataset>;
declare function requireNonEmptyColumn(reference: ColumnReference): Result<string, InvalidDataset>;
declare function requireQuantityColumn<U extends UnitName>(reference: ColumnReference): Result<Quantity<U>, InvalidDataset>;
declare function requireOptionalQuantityColumn<U extends UnitName>(reference: ColumnReference): Result<Quantity<U> | undefined, InvalidDataset>;
export { requireColumn, requireNonEmptyColumn, requireOptionalQuantityColumn, requireQuantityColumn };
