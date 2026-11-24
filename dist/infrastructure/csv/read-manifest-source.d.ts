import { type Result } from 'neverthrow';
import { type InvalidDataset } from '../../domain/data-source.ts';
import type { DatasetEntry } from './manifest.ts';
type ManifestSourceReference = {
    readonly folderPath: string;
    readonly entry: DatasetEntry;
    readonly file: string;
    readonly dataset: string;
};
declare function readManifestSourceBytes({ folderPath, entry, file, dataset, }: ManifestSourceReference): Result<Buffer, InvalidDataset>;
declare function readManifestSourceText({ folderPath, entry, file, dataset, }: ManifestSourceReference): Result<string, InvalidDataset>;
export { readManifestSourceBytes, readManifestSourceText };
export type { ManifestSourceReference };
