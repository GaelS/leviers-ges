import { Result, err, ok } from 'neverthrow'
import type {
  DepartementLookup,
  EstimationContext,
} from '../../../application/estimate/estimation-context.ts'
import { requireNonEmptyColumn, requireQuantityColumn } from '../../../application/require-column.ts'
import { sum } from '../../../domain/big-number.ts'
import {
  missingData,
  type DataRow,
  type DataSource,
  type DataSourceError,
} from '../../../domain/data-source.ts'
import type { Territory } from '../../../domain/territory.ts'
import type { UnknownTerritory } from '../../../domain/territory-index.ts'
import { quantity, type Hectares, type Tonnes } from '../../../domain/units.ts'
import type { EpciNitrogenPart } from './epci-nitrogen-part.ts'

const agriculturalAreaDataset = 'surface-agricole-utile/communes'
const nitrogenDataset = 'fertilisation-azotee/departements'
const epciOrganicDataset = 'fertilisation-azotee/organic-epci-departements'
const departementOrganicDataset = 'fertilisation-azotee/organic-departements'

type LocatedArea = {
  readonly commune: string
  readonly departement: string
  readonly hectares: Hectares
}

type DepartementAreas = {
  readonly departement: string
  readonly departementArea: Hectares
  readonly epciArea: Hectares
}

function toLocatedArea({
  row,
  getDepartementByCommune,
}: {
  row: DataRow
  getDepartementByCommune: DepartementLookup
}): Result<readonly LocatedArea[], DataSourceError> {
  const dataset = agriculturalAreaDataset
  return Result.combine([
    requireNonEmptyColumn({ dataset, row, column: 'code_commune' }),
    requireQuantityColumn<'Hectares'>({ dataset, row, column: 'agricultural_area_ha' }),
  ]).andThen(([commune, hectares]) =>
    getDepartementByCommune(commune).map((departement) =>
      departement === undefined ? [] : [{ commune, departement, hectares }],
    ),
  )
}

function sumHectares(areas: readonly LocatedArea[]): Hectares {
  return quantity<'Hectares'>(sum(areas.map(({ hectares }) => hectares)).toFixed())
}

function toDepartementAreas({
  areas,
  epciCommunes,
}: {
  areas: readonly LocatedArea[]
  epciCommunes: ReadonlySet<string>
}): readonly DepartementAreas[] {
  const epciAreas = areas.filter(({ commune }) => epciCommunes.has(commune))
  return [...Map.groupBy(epciAreas, ({ departement }) => departement)].map(
    ([departement, inEpci]) => ({
      departement,
      epciArea: sumHectares(inEpci),
      departementArea: sumHectares(areas.filter((area) => area.departement === departement)),
    }),
  )
}

function findRow({
  dataset,
  rows,
  column,
  key,
}: {
  dataset: string
  rows: readonly DataRow[]
  column: string
  key: string
}): Result<DataRow, DataSourceError> {
  const found = rows.find((row) => row[column] === key)
  return found === undefined ? err(missingData({ dataset, key })) : ok(found)
}

function readTonnes({
  dataset,
  rows,
  departement,
}: {
  dataset: string
  rows: readonly DataRow[]
  departement: string
}): Result<Tonnes, DataSourceError> {
  return findRow({ dataset, rows, column: 'code_departement', key: departement }).andThen((row) =>
    requireQuantityColumn<'Tonnes'>({
      dataset,
      row,
      column: 'nitrogen_delivered_tonnes_2021_2022',
    }),
  )
}

function readOrganicArea({
  dataset,
  rows,
  column,
  key,
}: {
  dataset: string
  rows: readonly DataRow[]
  column: string
  key: string
}): Result<Hectares, DataSourceError> {
  return findRow({ dataset, rows, column, key }).andThen((row) =>
    requireQuantityColumn<'Hectares'>({ dataset, row, column: 'organic_hectares' }),
  )
}

function toPart({
  areas,
  organic,
}: {
  areas: DepartementAreas
  organic: {
    readonly nitrogenRows: readonly DataRow[]
    readonly epciRows: readonly DataRow[]
    readonly departementRows: readonly DataRow[]
    readonly epci: string
  }
}): Result<EpciNitrogenPart, DataSourceError> {
  const { departement, epciArea, departementArea } = areas
  return Result.combine([
    readTonnes({ dataset: nitrogenDataset, rows: organic.nitrogenRows, departement }),
    readOrganicArea({
      dataset: epciOrganicDataset,
      rows: organic.epciRows,
      column: 'epci_departement',
      key: `${organic.epci}-${departement}`,
    }),
    readOrganicArea({
      dataset: departementOrganicDataset,
      rows: organic.departementRows,
      column: 'code_departement',
      key: departement,
    }),
  ]).map(([departementDelivered, epciOrganicArea, departementOrganicArea]) => ({
    departementDelivered,
    epciArea,
    epciOrganicArea,
    departementArea,
    departementOrganicArea,
  }))
}

function readEpciNitrogenParts({
  dataSource,
  territory,
  getCommunesOf,
  getDepartementByCommune,
}: {
  dataSource: DataSource
  territory: Territory<'epci'>
  getCommunesOf: EstimationContext['getCommunesOf']
  getDepartementByCommune: DepartementLookup
}): Result<readonly EpciNitrogenPart[], DataSourceError | UnknownTerritory> {
  return getCommunesOf(territory).andThen((epciCommunes) =>
    Result.combine([
      dataSource
        .rows(agriculturalAreaDataset)
        .andThen((rows) =>
          Result.combine(rows.map((row) => toLocatedArea({ row, getDepartementByCommune }))),
        )
        .map((located) => located.flat()),
      dataSource.rows(nitrogenDataset),
      dataSource.rows(epciOrganicDataset),
      dataSource.rows(departementOrganicDataset),
    ]).andThen(([areas, nitrogenRows, epciRows, departementRows]) =>
      Result.combine(
        toDepartementAreas({ areas, epciCommunes: new Set(epciCommunes) })
          .filter(({ epciArea }) => !epciArea.isZero())
          .map((departementAreas) =>
            toPart({
              areas: departementAreas,
              organic: { nitrogenRows, epciRows, departementRows, epci: territory.code },
            }),
          ),
      ),
    ),
  )
}

export { readEpciNitrogenParts }
