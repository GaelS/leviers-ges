import { Result } from 'neverthrow';
import { z } from 'zod';
import { type Violation } from './violation.ts';
declare const datasetEntrySchema: z.ZodObject<{
    file: z.ZodString;
    source: z.ZodString;
    link: z.ZodString;
    vintage: z.ZodString;
    retrievedOn: z.ZodString;
    checksum: z.ZodString;
    level: z.ZodOptional<z.ZodEnum<{
        departement: "departement";
        epci: "epci";
        region: "region";
    }>>;
    keyColumn: z.ZodString;
    columns: z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        unit: z.ZodString;
    }, z.core.$strip>>;
    controlTotals: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodString>>;
    sources: z.ZodOptional<z.ZodArray<z.ZodObject<{
        file: z.ZodString;
        source: z.ZodString;
        link: z.ZodOptional<z.ZodString>;
        retrievedOn: z.ZodString;
        checksum: z.ZodString;
    }, z.core.$strict>>>;
}, z.core.$strict>;
type DatasetEntry = z.infer<typeof datasetEntrySchema>;
declare function findDatasetEntry({ rootDirectory, folder, file, }: {
    rootDirectory: string;
    folder: string;
    file: string;
}): Result<DatasetEntry, Violation>;
export { findDatasetEntry };
export type { DatasetEntry };
