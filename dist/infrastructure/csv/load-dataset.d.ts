import { type Result } from 'neverthrow';
import type { DataRow, DatasetProvenance, InvalidDataset } from '../../domain/data-source.ts';
import type { Level } from '../../domain/territory.ts';
type Dataset = {
    readonly level: Level | undefined;
    readonly rows: ReadonlyMap<string, DataRow>;
    readonly provenance: DatasetProvenance;
};
declare function loadDataset({ rootDirectory, name, }: {
    rootDirectory: string;
    name: string;
}): Result<Dataset, InvalidDataset>;
export { loadDataset };
export type { Dataset };
