import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { sum, toBig } from '../../domain/big-number.ts'
import { createCsvDataSource } from '../../infrastructure/csv/csv-data-source.ts'
import { buildOccupationData } from './build-occupation-data.ts'
import { readOccupationSources } from './read-occupation-sources.ts'

const dataDirectory = join(import.meta.dirname, '..', '..', '..', 'data')

function committed(file: string): string {
  return readFileSync(join(dataDirectory, 'occupation-des-sols', file), 'utf8')
}

describe('buildOccupationData, sources versionnées ALDO', () => {
  const build = readOccupationSources(dataDirectory).andThen(buildOccupationData)._unsafeUnwrap()

  it.each([
    ['epcis-surfaces.csv', build.surfacesCsv],
    ['epcis-facteurs.csv', build.factorsCsv],
  ])('reconstruit %s à l’identique', (file, csv) => {
    expect(csv).toBe(committed(file))
  })

  it('compte 1 241 EPCI', () => {
    expect(build.epciCount).toBe(1241)
  })

  it('les forêts totalisent 18 497 382 ha, comme les surfaces de forêt de produits_bois', () => {
    const { forest_mixed_ha, forest_broadleaf_ha, forest_conifer_ha, forest_poplar_ha } =
      build.surfaceTotals
    const forests = [forest_mixed_ha, forest_broadleaf_ha, forest_conifer_ha, forest_poplar_ha]
    expect(sum(forests.map((hectares) => toBig(hectares ?? ''))).toFixed()).toBe('18497382')
  })

  it('le chargeur accepte les deux jeux, totaux de contrôle compris', () => {
    const dataSource = createCsvDataSource(dataDirectory)
    expect({
      surfaces: dataSource.rows('occupation-des-sols/epcis-surfaces')._unsafeUnwrap().length,
      factors: dataSource.rows('occupation-des-sols/epcis-facteurs')._unsafeUnwrap().length,
    }).toEqual({ surfaces: 1241, factors: 1241 })
  })
})
