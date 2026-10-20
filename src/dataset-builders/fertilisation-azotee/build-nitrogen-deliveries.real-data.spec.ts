import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { createCsvDataSource } from '../../infrastructure/csv/csv-data-source.ts'
import { buildNitrogenDeliveries } from './build-nitrogen-deliveries.ts'
import { readNitrogenSources } from './read-nitrogen-sources.ts'

const dataDirectory = join(import.meta.dirname, '..', '..', '..', 'data')

function readCommitted(file: string): string {
  return readFileSync(join(dataDirectory, 'fertilisation-azotee', file), 'utf8')
}

describe('buildNitrogenDeliveries, sources versionnées UNIFA et France Fertilisants', () => {
  const nitrogenDeliveries = readNitrogenSources(dataDirectory).andThen(buildNitrogenDeliveries)._unsafeUnwrap()

  it('reconstruit regions.csv à l’identique', () => {
    expect(nitrogenDeliveries.regions.csv).toBe(readCommitted('regions.csv'))
  })

  it('reconstruit departements.csv à l’identique', () => {
    expect(nitrogenDeliveries.departements.csv).toBe(readCommitted('departements.csv'))
  })

  it('compte 13 régions et 94 départements, avec leurs totaux d’azote', () => {
    expect({
      regions: nitrogenDeliveries.regions.regionCount,
      regionTonnes: [nitrogenDeliveries.regions.firstCampaignTonnes, nitrogenDeliveries.regions.secondCampaignTonnes],
      departements: nitrogenDeliveries.departements.departementCount,
      departementTonnes: nitrogenDeliveries.departements.tonnes,
    }).toEqual({
      regions: 13,
      regionTonnes: ['1746521', '1718954'],
      departements: 94,
      departementTonnes: '1746319',
    })
  })

  it('ne laisse aucun département ni aucune région hors de la géographie', () => {
    const dataSource = createCsvDataSource(dataDirectory)
    const communes = dataSource.rows('territoires/communes')._unsafeUnwrap()
    const regions = new Set(communes.map((row) => row['code_region']))
    const departements = new Set(communes.map((row) => row['code_departement']))
    const unknown = [
      ...dataSource
        .rows('fertilisation-azotee/regions')
        ._unsafeUnwrap()
        .filter((row) => !regions.has(row['code_region'])),
      ...dataSource
        .rows('fertilisation-azotee/departements')
        ._unsafeUnwrap()
        .filter((row) => !departements.has(row['code_departement'])),
    ]
    expect(unknown).toEqual([])
  })
})
