import { cpSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { readNetworkSources } from './read-network-sources.ts'

const committedDataDirectory = join(import.meta.dirname, '..', '..', '..', 'data')
const temporaryDirectories: string[] = []

function copyDataDirectory(): string {
  const directory = mkdtempSync(join(tmpdir(), 'leviers-ges-sources-'))
  temporaryDirectories.push(directory)
  cpSync(join(committedDataDirectory, 'reseaux-chaleur'), join(directory, 'reseaux-chaleur'), {
    recursive: true,
  })
  return directory
}

function removeSource(manifestPath: string, file: string): void {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
    datasets: { sources: { file: string }[] }[]
  }
  manifest.datasets.forEach((dataset) => {
    dataset.sources = dataset.sources.filter((source) => source.file !== file)
  })
  writeFileSync(manifestPath, JSON.stringify(manifest))
}

function removeSourcesField(manifestPath: string): void {
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as {
    datasets: Record<string, unknown>[]
  }
  manifest.datasets.forEach((dataset) => {
    delete dataset['sources']
  })
  writeFileSync(manifestPath, JSON.stringify(manifest))
}

afterEach(() => {
  temporaryDirectories.splice(0).forEach((directory) => {
    rmSync(directory, { recursive: true, force: true })
  })
})

describe('readNetworkSources', () => {
  it('lit les deux sources versionnées dont les empreintes correspondent au manifeste', () => {
    const sources = readNetworkSources(committedDataDirectory)._unsafeUnwrap()
    expect({
      sdesStartsWith: sources.sdesCsv.slice(0, 4),
      fcuStartsWith: sources.fcuCsv.slice(0, 6),
    }).toEqual({ sdesStartsWith: '"ID"', fcuStartsWith: 'id_fcu' })
  })

  it('refuse une source modifiée depuis son relevé', () => {
    const directory = copyDataDirectory()
    writeFileSync(join(directory, 'reseaux-chaleur', 'sources', 'fcu-reseaux-chaleur.csv'), 'autre')
    expect(readNetworkSources(directory)._unsafeUnwrapErr()).toMatchObject({
      kind: 'invalid_dataset',
      dataset: 'reseaux-chaleur/networks',
      reason: 'checksum_mismatch',
      detail: expect.stringContaining('sources/fcu-reseaux-chaleur.csv: expected ') as string,
    })
  })

  it('refuse une source absente du disque', () => {
    const directory = copyDataDirectory()
    rmSync(join(directory, 'reseaux-chaleur', 'sources', 'sdes-chaleur-commune-2024.csv'))
    expect(readNetworkSources(directory)._unsafeUnwrapErr()).toMatchObject({
      dataset: 'reseaux-chaleur/networks',
      reason: 'unreadable',
    })
  })

  it('refuse une source que le manifeste ne déclare pas', () => {
    const directory = copyDataDirectory()
    removeSource(join(directory, 'reseaux-chaleur', 'manifest.json'), 'sources/fcu-reseaux-chaleur.csv')
    expect(readNetworkSources(directory)._unsafeUnwrapErr()).toEqual({
      kind: 'invalid_dataset',
      dataset: 'reseaux-chaleur/networks',
      reason: 'invalid_manifest',
      detail: 'sources/fcu-reseaux-chaleur.csv',
    })
  })

  it('refuse un manifeste sans aucun champ sources', () => {
    const directory = copyDataDirectory()
    removeSourcesField(join(directory, 'reseaux-chaleur', 'manifest.json'))
    expect(readNetworkSources(directory)._unsafeUnwrapErr()).toEqual({
      kind: 'invalid_dataset',
      dataset: 'reseaux-chaleur/networks',
      reason: 'invalid_manifest',
      detail: 'sources/sdes-chaleur-commune-2024.csv',
    })
  })

  it('refuse un dossier de données sans le jeu des réseaux', () => {
    const directory = mkdtempSync(join(tmpdir(), 'leviers-ges-sources-'))
    temporaryDirectories.push(directory)
    expect(readNetworkSources(directory)._unsafeUnwrapErr()).toMatchObject({
      dataset: 'reseaux-chaleur/networks',
      reason: 'unknown_dataset',
    })
  })
})
