import { join } from 'node:path'
import { Result } from 'neverthrow'
import type { InvalidDataset } from '../../domain/data-source.ts'
import { findDatasetEntry } from '../../infrastructure/csv/manifest.ts'
import { readManifestSourceText } from '../../infrastructure/csv/read-manifest-source.ts'
import { toInvalidDataset } from '../../infrastructure/csv/violation.ts'

type GoodsTransportSources = {
  readonly tonneKilometresCsv: string
  readonly fleetCsv: string
  readonly ominenaCsv: string
}

const regionsDataset = 'transport-marchandises/regions'
const goodsFolder = 'transport-marchandises'
const tonneKilometresFile = 'sources/sdes-trm-tkm-par-region-et-type-de-flux-2024.csv'
const fleetFile = 'sources/sdes-parc-poids-lourds-2024-par-region.csv'
const ominenaFile = 'sources/ominea-co2-poids-lourds-diesel-g-par-vehicule-km-2024.csv'

function readGoodsTransportSources(
  dataDirectory: string,
): Result<GoodsTransportSources, InvalidDataset> {
  const folderPath = join(dataDirectory, goodsFolder)
  const readSource = (file: string, entry: Parameters<typeof readManifestSourceText>[0]['entry']) =>
    readManifestSourceText({ folderPath, entry, file, dataset: regionsDataset })
  return findDatasetEntry({
    rootDirectory: dataDirectory,
    folder: goodsFolder,
    file: 'regions.csv',
  })
    .mapErr(toInvalidDataset(regionsDataset))
    .andThen((entry) =>
      Result.combine([
        readSource(tonneKilometresFile, entry),
        readSource(fleetFile, entry),
        readSource(ominenaFile, entry),
      ]),
    )
    .map(([tonneKilometresCsv, fleetCsv, ominenaCsv]) => ({
      tonneKilometresCsv,
      fleetCsv,
      ominenaCsv,
    }))
}

export { readGoodsTransportSources }
