import { Result } from 'neverthrow'
import { requireQuantityColumn } from '../../../application/require-column.ts'
import type { DataRow, DataSource, DataSourceError } from '../../../domain/data-source.ts'
import type { Territory } from '../../../domain/territory.ts'
import type { Quantity, TCo2ePerHectarePerYear, UnitName } from '../../../domain/units.ts'
import type { ForestFactors, OccupationFactors } from './occupation-data.ts'

const factorsDataset = 'occupation-des-sols/epcis-facteurs'

function readFactor<U extends UnitName>({
  row,
  column,
}: {
  row: DataRow
  column: string
}): Result<Quantity<U>, DataSourceError> {
  return requireQuantityColumn<U>({ dataset: factorsDataset, row, column })
}

function toForestFactors({
  row,
  grassland,
}: {
  row: DataRow
  grassland: 'wooded' | 'herbaceous' | 'shrub'
}): Result<ForestFactors<TCo2ePerHectarePerYear>, DataSourceError> {
  return Result.combine([
    readFactor<'TCo2ePerHectarePerYear'>({ row, column: `${grassland}_grassland_to_forest_mixed` }),
    readFactor<'TCo2ePerHectarePerYear'>({
      row,
      column: `${grassland}_grassland_to_forest_broadleaf`,
    }),
    readFactor<'TCo2ePerHectarePerYear'>({ row, column: `${grassland}_grassland_to_forest_conifer` }),
    readFactor<'TCo2ePerHectarePerYear'>({ row, column: `${grassland}_grassland_to_forest_poplar` }),
  ]).map(([mixed, broadleaf, conifer, poplar]) => ({ mixed, broadleaf, conifer, poplar }))
}

function toOccupationFactors(row: DataRow): Result<OccupationFactors, DataSourceError> {
  return Result.combine([
    toForestFactors({ row, grassland: 'wooded' }),
    toForestFactors({ row, grassland: 'herbaceous' }),
    toForestFactors({ row, grassland: 'shrub' }),
    readFactor<'TCo2ePerHectarePerYear'>({ row, column: 'cropland_to_wetland' }),
    readFactor<'TCo2ePerHectarePerYear'>({ row, column: 'wooded_grassland_to_wetland' }),
    readFactor<'TCo2ePerHectarePerYear'>({ row, column: 'herbaceous_grassland_to_wetland' }),
    readFactor<'TCo2ePerHectarePerYear'>({ row, column: 'shrub_grassland_to_wetland' }),
    readFactor<'TCo2ePerHectare'>({ row, column: 'impervious_to_artificial_shrub' }),
    readFactor<'TCo2ePerHectare'>({ row, column: 'impervious_to_artificial_wooded' }),
  ]).map(
    ([
      wooded,
      herbaceous,
      shrub,
      croplandToWetland,
      woodedToWetland,
      herbaceousToWetland,
      shrubToWetland,
      imperviousToShrub,
      imperviousToWooded,
    ]) => ({
      grasslandToForest: { wooded, herbaceous, shrub },
      toWetland: {
        cropland: croplandToWetland,
        grassland: { wooded: woodedToWetland, herbaceous: herbaceousToWetland, shrub: shrubToWetland },
      },
      imperviousToArtificial: { shrub: imperviousToShrub, wooded: imperviousToWooded },
    }),
  )
}

function readOccupationFactors({
  dataSource,
  territory,
}: {
  dataSource: DataSource
  territory: Territory<'epci'>
}): Result<OccupationFactors, DataSourceError> {
  return dataSource.row(factorsDataset, territory).andThen(toOccupationFactors)
}

export { readOccupationFactors }
