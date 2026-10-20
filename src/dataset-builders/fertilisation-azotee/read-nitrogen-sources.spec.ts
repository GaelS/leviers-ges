import { rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  copyDataFolders,
  createTemporaryDirectory,
  removeSourceFromManifest,
  removeSourcesFromManifest,
} from '../../testing/data-folders.ts'
import { readNitrogenSources } from './read-nitrogen-sources.ts'

const committedDataDirectory = join(import.meta.dirname, '..', '..', '..', 'data')
const folder = 'fertilisation-azotee'

function copyDataDirectory(): string {
  return copyDataFolders({ from: committedDataDirectory, folders: [folder] })
}

describe('readNitrogenSources', () => {
  it('lit les deux relevés versionnés dont les empreintes correspondent au manifeste', () => {
    const sources = readNitrogenSources(committedDataDirectory)._unsafeUnwrap()
    expect({
      regionsStartWith: sources.regionDeliveriesCsv.slice(0, 8),
      departementsStartWith: sources.departementDeliveriesCsv.slice(0, 8),
    }).toEqual({ regionsStartWith: 'campagne', departementsStartWith: 'campagne' })
  })

  it('refuse un relevé modifié depuis son extraction', () => {
    const directory = copyDataDirectory()
    writeFileSync(join(directory, folder, 'sources', 'azote-livre-par-region.csv'), 'autre')
    expect(readNitrogenSources(directory)._unsafeUnwrapErr()).toMatchObject({
      kind: 'invalid_dataset',
      dataset: 'fertilisation-azotee/regions',
      reason: 'checksum_mismatch',
    })
  })

  it('refuse un relevé absent du disque', () => {
    const directory = copyDataDirectory()
    rmSync(join(directory, folder, 'sources', 'azote-livre-par-departement-2021-2022.csv'))
    expect(readNitrogenSources(directory)._unsafeUnwrapErr()).toMatchObject({
      dataset: 'fertilisation-azotee/regions',
      reason: 'unreadable',
    })
  })

  it('refuse un relevé que le manifeste ne déclare pas', () => {
    const directory = copyDataDirectory()
    removeSourceFromManifest({
      directory,
      folder,
      file: 'sources/azote-livre-par-departement-2021-2022.csv',
    })
    expect(readNitrogenSources(directory)._unsafeUnwrapErr()).toEqual({
      kind: 'invalid_dataset',
      dataset: 'fertilisation-azotee/regions',
      reason: 'invalid_manifest',
      detail: 'sources/azote-livre-par-departement-2021-2022.csv',
    })
  })

  it('refuse un manifeste sans aucun champ sources', () => {
    const directory = copyDataDirectory()
    removeSourcesFromManifest({ directory, folder })
    expect(readNitrogenSources(directory)._unsafeUnwrapErr()).toMatchObject({
      reason: 'invalid_manifest',
    })
  })

  it('refuse un dossier de données sans le jeu des régions', () => {
    expect(readNitrogenSources(createTemporaryDirectory())._unsafeUnwrapErr()).toMatchObject({
      dataset: 'fertilisation-azotee/regions',
      reason: 'unknown_dataset',
    })
  })
})
