import { Result, err, ok } from 'neverthrow'
import {
  invalidDataset,
  type DataRow,
  type DataSource,
  type DataSourceError,
  type InvalidDataset,
} from '../../domain/data-source.js'
import { buildTerritoryIndex, type Commune, type TerritoryIndex } from '../../domain/territory-index.js'

const communesDataset = 'territoires/communes'

function requireColumn(row: DataRow, column: string): Result<string, InvalidDataset> {
  const value = row[column]
  return value === undefined
    ? err(invalidDataset({ dataset: communesDataset, reason: 'columns_mismatch', detail: column }))
    : ok(value)
}

function requireNonEmptyColumn(row: DataRow, column: string): Result<string, InvalidDataset> {
  return requireColumn(row, column).andThen((value) =>
    value.trim() === ''
      ? err(invalidDataset({ dataset: communesDataset, reason: 'empty_key', detail: column }))
      : ok(value),
  )
}

function toCommune(row: DataRow): Result<Commune, InvalidDataset> {
  return Result.combine([
    requireNonEmptyColumn(row, 'code_commune'),
    requireColumn(row, 'code_epci'),
    requireNonEmptyColumn(row, 'code_departement'),
    requireNonEmptyColumn(row, 'code_region'),
  ]).map(([code, epci, departement, region]) => ({
    code,
    epci: epci === '' ? undefined : epci,
    departement,
    region,
  }))
}

function loadTerritoryIndex(dataSource: DataSource): Result<TerritoryIndex, DataSourceError> {
  return dataSource
    .rows(communesDataset)
    .andThen((rows) => Result.combine(rows.map(toCommune)))
    .map(buildTerritoryIndex)
}

export { loadTerritoryIndex }
