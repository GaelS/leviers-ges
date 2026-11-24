import { join } from 'node:path';
import { err, ok } from 'neverthrow';
import { findDatasetEntry } from "./manifest.js";
import { parseCsvText } from "./parse-csv-text.js";
import { readVerifiedText } from "./read-verified-file.js";
import { checkCells, checkColumns, checkControlTotals, checkNotEmpty, indexByKey, } from "./validate-rows.js";
import { toInvalidDataset, violation } from "./violation.js";
const datasetNamePattern = /^([a-z0-9-]+)\/([a-z0-9-]+)$/;
function parseCsv(text) {
    return parseCsvText({ text, delimiter: ',' });
}
function splitDatasetName(name) {
    const match = datasetNamePattern.exec(name);
    const [, folder, file] = match ?? [];
    return folder === undefined || file === undefined
        ? err(violation('unknown_dataset', name))
        : ok({ folder, file: `${file}.csv` });
}
function loadDataset({ rootDirectory, name, }) {
    return splitDatasetName(name)
        .andThen(({ folder, file }) => findDatasetEntry({ rootDirectory, folder, file }).map((entry) => ({ entry, folder })))
        .andThen(({ entry, folder }) => readVerifiedText({
        path: join(rootDirectory, folder, entry.file),
        expectedChecksum: entry.checksum,
    })
        .andThen(parseCsv)
        .andThen(checkNotEmpty)
        .andThen((rows) => checkColumns(rows, entry))
        .andThen(checkCells)
        .andThen((rows) => checkControlTotals(rows, entry.controlTotals ?? {}))
        .andThen((rows) => indexByKey(rows, entry.keyColumn))
        .map((rows) => ({
        level: entry.level,
        rows,
        provenance: {
            dataset: name,
            source: entry.source,
            vintage: entry.vintage,
            retrievedOn: entry.retrievedOn,
        },
    })))
        .mapErr(toInvalidDataset(name));
}
export { loadDataset };
//# sourceMappingURL=load-dataset.js.map