import { Result } from 'neverthrow';
import { type DataSource, type DataSourceError } from '../../../domain/data-source.ts';
import type { WasteTypeTreatment } from '../../../domain/waste-treatment.ts';
declare function readWasteTreatment({ dataSource, communes, }: {
    dataSource: DataSource;
    communes: readonly string[];
}): Result<readonly WasteTypeTreatment[], DataSourceError>;
export { readWasteTreatment };
