import type { DataSource } from '../../domain/data-source.ts';
type DatasetReadRecorder = {
    readonly dataSource: DataSource;
    readonly takeReadDatasets: () => readonly string[];
};
declare function recordDatasetReads(dataSource: DataSource): DatasetReadRecorder;
export { recordDatasetReads };
export type { DatasetReadRecorder };
