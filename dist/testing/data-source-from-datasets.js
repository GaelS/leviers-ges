import { err, ok } from 'neverthrow';
import { invalidDataset } from "../domain/data-source.js";
function dataSourceFromDatasets(datasets) {
    const unusedError = invalidDataset({ dataset: 'unused', reason: 'unknown_dataset', detail: '' });
    return {
        provenance: (dataset) => dataset in datasets
            ? ok({ dataset, source: 'Jeu de test', vintage: '2024', retrievedOn: '2026-10-08' })
            : err(invalidDataset({ dataset, reason: 'unknown_dataset', detail: dataset })),
        constant: () => err(unusedError),
        row: () => err(unusedError),
        rows: (dataset) => {
            const rows = datasets[dataset];
            return rows === undefined
                ? err(invalidDataset({ dataset, reason: 'unknown_dataset', detail: dataset }))
                : ok(rows);
        },
    };
}
export { dataSourceFromDatasets };
//# sourceMappingURL=data-source-from-datasets.js.map