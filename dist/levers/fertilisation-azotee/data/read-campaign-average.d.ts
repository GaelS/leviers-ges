import { Result } from 'neverthrow';
import type { DataRow, InvalidDataset } from '../../../domain/data-source.ts';
import { type Tonnes } from '../../../domain/units.ts';
declare function readCampaignAverage({ dataset, row, }: {
    dataset: string;
    row: DataRow;
}): Result<Tonnes, InvalidDataset>;
export { readCampaignAverage };
