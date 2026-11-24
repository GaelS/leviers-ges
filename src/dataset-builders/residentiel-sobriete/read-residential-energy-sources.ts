import { join } from 'node:path'
import { Result } from 'neverthrow'
import type { InvalidDataset } from '../../domain/data-source.ts'
import { findDatasetEntry, type DatasetEntry } from '../../infrastructure/csv/manifest.ts'
import { readManifestSourceText } from '../../infrastructure/csv/read-manifest-source.ts'
import { toInvalidDataset } from '../../infrastructure/csv/violation.ts'
import type { ResidentialEnergySources } from './build-residential-energy.ts'
import { CEREN_NATIONAL_FUEL_CONSUMPTION_2024 } from './ceren-national-fuel-consumption.ts'

const datasetFolder = 'residentiel-sobriete'
const regionalBilanFile = 'sources/sdes-bilan-energie-residentiel-2024.csv'
const irisElectricityFile = 'sources/sdes-electricite-iris-2024-residentiel-par-departement.csv'
const irisGasFile = 'sources/sdes-gaz-iris-2024-residentiel-par-departement.csv'
const oilSalesFile = 'sources/sdes-ventes-produits-petroliers-departement.csv'
const heatFile = 'sources/sdes-chaleur-commune-2024.csv'

function toDatasetName(file: string): string {
  return `${datasetFolder}/${file}`
}

function findEntry({
  dataDirectory,
  file,
}: {
  dataDirectory: string
  file: string
}): Result<DatasetEntry, InvalidDataset> {
  return findDatasetEntry({ rootDirectory: dataDirectory, folder: datasetFolder, file }).mapErr(
    toInvalidDataset(toDatasetName(file)),
  )
}

function readText({
  dataDirectory,
  entry,
  file,
}: {
  dataDirectory: string
  entry: DatasetEntry
  file: string
}): Result<string, InvalidDataset> {
  return readManifestSourceText({
    folderPath: join(dataDirectory, datasetFolder),
    entry,
    file,
    dataset: toDatasetName(file),
  })
}

function readResidentialEnergySources(
  dataDirectory: string,
): Result<ResidentialEnergySources, InvalidDataset> {
  const regionsEntry = findEntry({ dataDirectory, file: 'regions.csv' })
  const departementsEntry = findEntry({ dataDirectory, file: 'departements.csv' })
  const heatNetworksEntry = findEntry({ dataDirectory, file: 'heat-networks.csv' })
  return Result.combine([regionsEntry, departementsEntry, heatNetworksEntry]).andThen(
    ([regions, departements, heatNetworks]) => {
      const regionalBilanText = readText({
        dataDirectory,
        entry: regions,
        file: regionalBilanFile,
      })
      const irisElectricityText = readText({
        dataDirectory,
        entry: departements,
        file: irisElectricityFile,
      })
      const irisGasText = readText({ dataDirectory, entry: departements, file: irisGasFile })
      const oilSalesText = readText({ dataDirectory, entry: departements, file: oilSalesFile })
      const heatText = readText({ dataDirectory, entry: heatNetworks, file: heatFile })
      return Result.combine([
        regionalBilanText,
        irisElectricityText,
        irisGasText,
        oilSalesText,
        heatText,
      ]).map(([regionalBilanCsv, irisElectricityCsv, irisGasCsv, oilSalesCsv, heatCsv]) => ({
        regionalBilanCsv,
        cerenFuelConsumption: CEREN_NATIONAL_FUEL_CONSUMPTION_2024,
        irisElectricityCsv,
        irisGasCsv,
        oilSalesCsv,
        heatCsv,
      }))
    },
  )
}

export { readResidentialEnergySources }
