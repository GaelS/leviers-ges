import { rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  copyDataFolders,
  removeSourceFromManifest,
  removeSourcesFromManifest,
} from '../../testing/data-folders.ts'
import { readTransportSources } from './read-transport-sources.ts'

const committedDataDirectory = join(import.meta.dirname, '..', '..', '..', 'data')
const folder = 'transport-personnes'
const commutingFile = 'sources/insee-sdes-domicile-travail-2022-agregats-par-mode.csv'
const dataset = 'transport-personnes/regions.csv'

function copyDataDirectory(): string {
  return copyDataFolders({ from: committedDataDirectory, folders: [folder] })
}

describe('readTransportSources', () => {
  it('lit les deux sources versionnées dont les empreintes correspondent au manifeste', () => {
    const sources = readTransportSources(committedDataDirectory)._unsafeUnwrap()
    expect({
      commutingStartsWith: sources.commutingCsv.slice(0, 4),
      fleetStartsWith: sources.fleetCsv.slice(0, 6),
    }).toEqual({ commutingStartsWith: 'side', fleetStartsWith: 'maille' })
  })

  it('refuse une source modifiée depuis son relevé', () => {
    const directory = copyDataDirectory()
    writeFileSync(join(directory, folder, commutingFile), 'autre')
    expect(readTransportSources(directory)._unsafeUnwrapErr()).toMatchObject({
      kind: 'invalid_dataset',
      dataset,
      reason: 'checksum_mismatch',
      detail: expect.stringContaining(`${commutingFile}: expected `) as string,
    })
  })

  it('refuse une source absente du disque', () => {
    const directory = copyDataDirectory()
    rmSync(join(directory, folder, commutingFile))
    expect(readTransportSources(directory)._unsafeUnwrapErr()).toMatchObject({
      dataset,
      reason: 'unreadable',
    })
  })

  it('refuse une source que le manifeste ne déclare pas', () => {
    const directory = copyDataDirectory()
    removeSourceFromManifest({ directory, folder, file: commutingFile })
    expect(readTransportSources(directory)._unsafeUnwrapErr()).toEqual({
      kind: 'invalid_dataset',
      dataset,
      reason: 'invalid_manifest',
      detail: commutingFile,
    })
  })

  it('refuse un manifeste sans aucun champ sources', () => {
    const directory = copyDataDirectory()
    removeSourcesFromManifest({ directory, folder })
    expect(readTransportSources(directory)._unsafeUnwrapErr()).toMatchObject({
      dataset,
      reason: 'invalid_manifest',
    })
  })

  it('refuse un dossier sans manifeste', () => {
    const directory = copyDataFolders({ from: committedDataDirectory, folders: [] })
    expect(readTransportSources(directory)._unsafeUnwrapErr()).toMatchObject({
      dataset,
      reason: 'unknown_dataset',
    })
  })
})
