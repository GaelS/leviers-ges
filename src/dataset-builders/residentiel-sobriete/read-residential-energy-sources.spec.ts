import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  copyDataFolders,
  createTemporaryDirectory,
  removeSourceFromManifest,
} from '../../testing/data-folders.ts'
import { readResidentialEnergySources } from './read-residential-energy-sources.ts'

const committedDataDirectory = join(import.meta.dirname, '..', '..', '..', 'data')
const folder = 'residentiel-sobriete'
const irisElectricityCsv = 'sources/sdes-electricite-iris-2024-residentiel-par-departement.csv'
const heatCsv = 'sources/sdes-chaleur-commune-2024.csv'

function copyDataDirectory(): string {
  return copyDataFolders({ from: committedDataDirectory, folders: [folder] })
}

describe('readResidentialEnergySources', () => {
  it('lit les cinq sources versionnées dont les empreintes correspondent au manifeste', () => {
    const sources = readResidentialEnergySources(committedDataDirectory)._unsafeUnwrap()
    expect({
      regionalBilanStartsWith: sources.regionalBilanCsv.slice(0, 7),
      irisElectricityStartsWith: sources.irisElectricityCsv.slice(0, 16),
      irisGasStartsWith: sources.irisGasCsv.slice(0, 16),
      oilSalesStartsWith: sources.oilSalesCsv.slice(0, 18),
      heatStartsWith: sources.heatCsv.slice(0, 4),
    }).toEqual({
      regionalBilanStartsWith: 'fichier',
      irisElectricityStartsWith: 'code_departement',
      irisGasStartsWith: 'code_departement',
      oilSalesStartsWith: '"DEPARTEMENT_CODE"',
      heatStartsWith: '"ID"',
    })
  })

  it('reprend le fioul et le GPL nationaux du CEREN 2024 comme constantes, sans classeur', () => {
    const sources = readResidentialEnergySources(committedDataDirectory)._unsafeUnwrap()
    expect(sources.cerenFuelConsumption).toEqual({ fuelOilTwh: '32', liquefiedPetroleumGasTwh: '8' })
  })

  it.each([
    ['le bilan régional', 'sources/sdes-bilan-energie-residentiel-2024.csv'],
    ['un extrait local', irisElectricityCsv],
    ['le jeu des réseaux de chaleur', heatCsv],
  ])('refuse %s modifié depuis son relevé', (_label, file) => {
    const directory = copyDataDirectory()
    writeFileSync(join(directory, folder, file), 'autre')
    expect(readResidentialEnergySources(directory)._unsafeUnwrapErr()).toMatchObject({
      kind: 'invalid_dataset',
      reason: 'checksum_mismatch',
      detail: expect.stringContaining(`${file}: expected `) as string,
    })
  })

  it('refuse un manifeste qui ne déclare plus une source', () => {
    const directory = copyDataDirectory()
    removeSourceFromManifest({ directory, folder, file: irisElectricityCsv })
    expect(readResidentialEnergySources(directory)._unsafeUnwrapErr()).toEqual({
      kind: 'invalid_dataset',
      dataset: `residentiel-sobriete/${irisElectricityCsv}`,
      reason: 'invalid_manifest',
      detail: irisElectricityCsv,
    })
  })

  it('refuse un dossier de données sans les jeux du résidentiel', () => {
    expect(
      readResidentialEnergySources(createTemporaryDirectory())._unsafeUnwrapErr(),
    ).toMatchObject({
      dataset: 'residentiel-sobriete/regions.csv',
      reason: 'unknown_dataset',
    })
  })
})
