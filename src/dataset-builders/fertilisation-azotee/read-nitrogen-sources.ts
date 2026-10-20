import { join } from 'node:path'
import { Result } from 'neverthrow'
import type { InvalidDataset } from '../../domain/data-source.ts'
import { findDatasetEntry } from '../../infrastructure/csv/manifest.ts'
import { readManifestSourceText } from '../../infrastructure/csv/read-manifest-source.ts'
import { toInvalidDataset } from '../../infrastructure/csv/violation.ts'

type NitrogenSources = {
  readonly regionDeliveriesCsv: string
  readonly departementDeliveriesCsv: string
}

const regionsDataset = 'fertilisation-azotee/regions'
const nitrogenFolder = 'fertilisation-azotee'
const regionDeliveriesFile = 'sources/azote-livre-par-region.csv'
const departementDeliveriesFile = 'sources/azote-livre-par-departement-2021-2022.csv'

function readNitrogenSources(dataDirectory: string): Result<NitrogenSources, InvalidDataset> {
  const folderPath = join(dataDirectory, nitrogenFolder)
  return findDatasetEntry({
    rootDirectory: dataDirectory,
    folder: nitrogenFolder,
    file: 'regions.csv',
  })
    .mapErr(toInvalidDataset(regionsDataset))
    .andThen((entry) =>
      Result.combine([
        readManifestSourceText({
          folderPath,
          entry,
          file: regionDeliveriesFile,
          dataset: regionsDataset,
        }),
        readManifestSourceText({
          folderPath,
          entry,
          file: departementDeliveriesFile,
          dataset: regionsDataset,
        }),
      ]),
    )
    .map(([regionDeliveriesCsv, departementDeliveriesCsv]) => ({
      regionDeliveriesCsv,
      departementDeliveriesCsv,
    }))
}

export { readNitrogenSources }
