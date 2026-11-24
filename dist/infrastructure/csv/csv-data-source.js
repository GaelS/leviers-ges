import { resolve } from 'node:path';
import { err, ok } from 'neverthrow';
import { invalidDataset, missingData, } from "../../domain/data-source.js";
import { loadDataset } from "./load-dataset.js";
const valueColumn = 'value';
function createCsvDataSource(rootDirectory) {
    const absoluteRoot = resolve(rootDirectory);
    const loadedDatasets = new Map();
    function dataset(name) {
        const cached = loadedDatasets.get(name);
        if (cached !== undefined)
            return cached;
        const loaded = loadDataset({ rootDirectory: absoluteRoot, name });
        const isTransientFailure = loaded.isErr() && loaded.error.reason === 'unreadable';
        if (!isTransientFailure)
            loadedDatasets.set(name, loaded);
        return loaded;
    }
    function findRow({ name, rows, key, }) {
        const row = rows.get(key);
        return row === undefined ? err(missingData({ dataset: name, key })) : ok(row);
    }
    return {
        provenance: (name) => dataset(name).map(({ provenance }) => provenance),
        constant: (name, constantName) => dataset(name)
            .andThen(({ rows }) => findRow({ name, rows, key: constantName }))
            .andThen((row) => {
            const value = row[valueColumn];
            const isBlank = value === undefined || value === '';
            return isBlank ? err(missingData({ dataset: name, key: constantName })) : ok(value);
        }),
        rows: (name) => dataset(name).map(({ rows }) => [...rows.values()]),
        row: (name, territory) => dataset(name).andThen(({ level, rows }) => level === territory.level
            ? findRow({ name, rows, key: territory.code })
            : err(invalidDataset({
                dataset: name,
                reason: 'level_mismatch',
                detail: `expected ${String(level)}, got ${territory.level}`,
            }))),
    };
}
export { createCsvDataSource };
//# sourceMappingURL=csv-data-source.js.map