import { join } from 'node:path'
import { Result, err } from 'neverthrow'
import { invalidDataset, type InvalidDataset } from '../../domain/data-source.ts'
import { findDatasetEntry, type DatasetEntry } from '../../infrastructure/csv/manifest.ts'
import { readVerifiedText } from '../../infrastructure/csv/read-verified-text.ts'
import { toInvalidDataset } from '../../infrastructure/csv/violation.ts'

type NetworkSources = {
  readonly sdesCsv: string
  readonly fcuCsv: string
}

const networksDataset = 'reseaux-chaleur/networks'
const networksFolder = 'reseaux-chaleur'
const sdesFile = 'sources/sdes-chaleur-commune-2024.csv'
const fcuFile = 'sources/fcu-reseaux-chaleur.csv'

function readSource({
  dataDirectory,
  entry,
  file,
}: {
  dataDirectory: string
  entry: DatasetEntry
  file: string
}): Result<string, InvalidDataset> {
  const source = entry.sources?.find((candidate) => candidate.file === file)
  if (source === undefined) {
    return err(invalidDataset({ dataset: networksDataset, reason: 'invalid_manifest', detail: file }))
  }
  return readVerifiedText({
    path: join(dataDirectory, networksFolder, file),
    expectedChecksum: source.checksum,
  }).mapErr(({ reason, detail }) =>
    invalidDataset({ dataset: networksDataset, reason, detail: `${file}: ${detail}` }),
  )
}

function readNetworkSources(dataDirectory: string): Result<NetworkSources, InvalidDataset> {
  return findDatasetEntry({
    rootDirectory: dataDirectory,
    folder: networksFolder,
    file: 'networks.csv',
  })
    .mapErr(toInvalidDataset(networksDataset))
    .andThen((entry) =>
      Result.combine([
        readSource({ dataDirectory, entry, file: sdesFile }),
        readSource({ dataDirectory, entry, file: fcuFile }),
      ]),
    )
    .map(([sdesCsv, fcuCsv]) => ({ sdesCsv, fcuCsv }))
}

export { readNetworkSources }
export type { NetworkSources }
