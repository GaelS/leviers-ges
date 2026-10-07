import { err, ok } from 'neverthrow'
import { invalidDataset, type DataRow, type DataSource } from '../domain/data-source.js'

function dataSourceFromDatasets(datasets: Readonly<Record<string, readonly DataRow[]>>): DataSource {
  const unusedError = invalidDataset({ dataset: 'unused', reason: 'unknown_dataset', detail: '' })
  return {
    constant: () => err(unusedError),
    row: () => err(unusedError),
    rows: (dataset) => {
      const rows = datasets[dataset]
      return rows === undefined
        ? err(invalidDataset({ dataset, reason: 'unknown_dataset', detail: dataset }))
        : ok(rows)
    },
  }
}

export { dataSourceFromDatasets }
