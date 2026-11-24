import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Result, err, ok } from 'neverthrow';
import { z } from 'zod';
import { levels } from "../../domain/territory.js";
import { violation } from "./violation.js";
const sourceEntrySchema = z.strictObject({
    file: z.string(),
    source: z.string(),
    link: z.string().optional(),
    retrievedOn: z.string(),
    checksum: z.string().regex(/^[0-9a-f]{64}$/),
});
const datasetEntrySchema = z.strictObject({
    file: z.string(),
    source: z.string(),
    link: z.string(),
    vintage: z.string(),
    retrievedOn: z.string(),
    checksum: z.string().regex(/^[0-9a-f]{64}$/),
    level: z.enum(levels).optional(),
    keyColumn: z.string(),
    columns: z.array(z.object({ name: z.string(), unit: z.string() })),
    controlTotals: z.record(z.string(), z.string()).optional(),
    sources: z.array(sourceEntrySchema).optional(),
});
const manifestSchema = z.object({ datasets: z.array(datasetEntrySchema) });
const readText = Result.fromThrowable((path) => readFileSync(path, 'utf8'), (error) => violation(/ENOENT|ENOTDIR/.test(String(error)) ? 'unknown_dataset' : 'unreadable', String(error)));
const parseJson = Result.fromThrowable((text) => JSON.parse(text), (error) => violation('invalid_manifest', String(error)));
function findDatasetEntry({ rootDirectory, folder, file, }) {
    return readText(join(rootDirectory, folder, 'manifest.json'))
        .andThen(parseJson)
        .andThen((json) => {
        const parsed = manifestSchema.safeParse(json);
        return parsed.success
            ? ok(parsed.data)
            : err(violation('invalid_manifest', parsed.error.message));
    })
        .andThen((manifest) => {
        const entry = manifest.datasets.find((candidate) => candidate.file === file);
        return entry === undefined ? err(violation('unknown_dataset', file)) : ok(entry);
    });
}
export { findDatasetEntry };
//# sourceMappingURL=manifest.js.map