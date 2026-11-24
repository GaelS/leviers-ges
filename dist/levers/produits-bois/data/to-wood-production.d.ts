import { Result } from 'neverthrow';
import type { DataRow, InvalidDataset } from '../../../domain/data-source.ts';
import type { WoodProduction } from './wood-production.ts';
declare function toWoodProduction({ dataset, row, }: {
    dataset: string;
    row: DataRow;
}): Result<WoodProduction, InvalidDataset>;
export { toWoodProduction };
