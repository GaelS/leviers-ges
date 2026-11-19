import { Result } from 'neverthrow'
import { requireQuantityColumn } from '../../../application/require-column.ts'
import type { DataRow, DataSource, DataSourceError } from '../../../domain/data-source.ts'
import type { Territory } from '../../../domain/territory.ts'
import type { Hectares } from '../../../domain/units.ts'
import type { OccupationAreas } from './occupation-data.ts'

const areasDataset = 'occupation-des-sols/epcis-surfaces'

function readHectares({ row, column }: { row: DataRow; column: string }): Result<Hectares, DataSourceError> {
  return requireQuantityColumn<'Hectares'>({ dataset: areasDataset, row, column })
}

function toOccupationAreas(row: DataRow): Result<OccupationAreas, DataSourceError> {
  return Result.combine([
    readHectares({ row, column: 'cropland_ha' }),
    readHectares({ row, column: 'wooded_grassland_ha' }),
    readHectares({ row, column: 'herbaceous_grassland_ha' }),
    readHectares({ row, column: 'shrub_grassland_ha' }),
    readHectares({ row, column: 'forest_mixed_ha' }),
    readHectares({ row, column: 'forest_broadleaf_ha' }),
    readHectares({ row, column: 'forest_conifer_ha' }),
    readHectares({ row, column: 'forest_poplar_ha' }),
    readHectares({ row, column: 'artificial_shrub_ha' }),
    readHectares({ row, column: 'artificial_wooded_ha' }),
  ]).map(
    ([
      cropland,
      woodedGrassland,
      herbaceousGrassland,
      shrubGrassland,
      mixedForest,
      broadleafForest,
      coniferForest,
      poplarForest,
      shrubArtificial,
      woodedArtificial,
    ]) => ({
      cropland,
      grassland: { wooded: woodedGrassland, herbaceous: herbaceousGrassland, shrub: shrubGrassland },
      forest: {
        mixed: mixedForest,
        broadleaf: broadleafForest,
        conifer: coniferForest,
        poplar: poplarForest,
      },
      artificial: { shrub: shrubArtificial, wooded: woodedArtificial },
    }),
  )
}

function readOccupationAreas({
  dataSource,
  territory,
}: {
  dataSource: DataSource
  territory: Territory<'epci'>
}): Result<OccupationAreas, DataSourceError> {
  return dataSource.row(areasDataset, territory).andThen(toOccupationAreas)
}

export { readOccupationAreas }
