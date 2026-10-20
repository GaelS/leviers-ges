import { groupBy, sortBy } from 'es-toolkit'
import { Result } from 'neverthrow'
import { requireColumn } from '../../application/require-column.ts'
import { parseBig, sum, toBig } from '../../domain/big-number.ts'
import type { DataRow, InvalidDataset } from '../../domain/data-source.ts'
import { parseCsvText } from '../../infrastructure/csv/parse-csv-text.ts'
import { toInvalidDataset } from '../../infrastructure/csv/violation.ts'
import { toCsvText } from '../to-csv-text.ts'
import {
  listSecretCategories,
  SECRET_STATISTIC_MARK,
  toLivestockHeadcount,
  type LivestockCategories,
  type LivestockHeadcount,
} from './livestock-headcount.ts'

type Level = 'region' | 'departement'

type LivestockHeadcountsLevel = {
  readonly csv: string
  readonly territoryCount: number
  readonly secretCellCount: number
  readonly totals: Readonly<Record<string, string>>
}

type LivestockHeadcounts = {
  readonly regions: LivestockHeadcountsLevel
  readonly departements: LivestockHeadcountsLevel
}

type TerritoryHeadcount = {
  readonly code: string
  readonly headcount: LivestockHeadcount
  readonly secretCells: readonly string[]
}

const agresteDataset = 'elevage-durable/sources/agreste-ra2020-cheptels-departement-region.csv'
const cartostatDataset =
  'elevage-durable/sources/cartostat-vaches-laitieres-2020-departements-regions.csv'

// Source : data/elevage-durable/manifest.json, colonnes de regions.csv et departements.csv
const HEADCOUNT_COLUMNS = [
  ['dairy_cows', (headcount: LivestockHeadcount) => headcount.dairyCows],
  ['other_cattle', (headcount: LivestockHeadcount) => headcount.otherCattle],
  ['sows', (headcount: LivestockHeadcount) => headcount.sows],
  ['other_pigs', (headcount: LivestockHeadcount) => headcount.otherPigs],
  ['goats', (headcount: LivestockHeadcount) => headcount.goats],
  ['sheep', (headcount: LivestockHeadcount) => headcount.sheep],
  ['horses', (headcount: LivestockHeadcount) => headcount.horses],
  ['mules_and_donkeys', (headcount: LivestockHeadcount) => headcount.mulesAndDonkeys],
  ['laying_hens', (headcount: LivestockHeadcount) => headcount.layingHens],
  ['broilers', (headcount: LivestockHeadcount) => headcount.broilers],
  ['other_poultry', (headcount: LivestockHeadcount) => headcount.otherPoultry],
] as const

// Source : Insee, code officiel géographique : les 13 régions de France métropolitaine ; l'outre-mer est hors du champ des données d'élevage de ce dépôt (choix de conception, non validé)
const METROPOLITAN_REGION_CODES: ReadonlySet<string> = new Set([
  '11', '24', '27', '28', '32', '44', '52', '53', '75', '76', '84', '93', '94',
])

// Source : Insee, code officiel géographique : un code de département métropolitain compte deux chiffres, ou 2A et 2B pour la Corse
const METROPOLITAN_DEPARTEMENT_CODE = /^(\d{2}|2A|2B)$/

// Source : cartostat, vaches laitières 2020 : « secret » ou une cellule absente compte pour zéro vache (choix de conception, non validé)
const NO_DAIRY_COWS = toBig('0')

// Source : data/elevage-durable/manifest.json : repère, dans la liste des cellules sous secret, la cellule des vaches laitières de cartostat
const DAIRY_COWS_CELL = 'dairy_cows'

// Source : Agreste, recensement agricole 2020, cheptels : le code d'une région est préfixé par NR
const REGION_GEOGRAPHY_PREFIX = 'NR'

function toTerritoryCode({ geography, level }: { geography: string; level: Level }): string | undefined {
  if (level === 'region') {
    if (!geography.startsWith(REGION_GEOGRAPHY_PREFIX)) return undefined
    const code = geography.slice(REGION_GEOGRAPHY_PREFIX.length)
    return METROPOLITAN_REGION_CODES.has(code) ? code : undefined
  }
  return METROPOLITAN_DEPARTEMENT_CODE.test(geography) ? geography : undefined
}

function readCategories({
  agresteCsv,
  level,
}: {
  agresteCsv: string
  level: Level
}): Result<ReadonlyMap<string, LivestockCategories>, InvalidDataset> {
  const dataset = agresteDataset
  return parseCsvText({ text: agresteCsv, delimiter: ',' })
    .mapErr(toInvalidDataset(dataset))
    .andThen((rows) =>
      Result.combine(
        rows.map((row: DataRow) =>
          Result.combine([
            requireColumn({ dataset, row, column: 'geographie' }),
            requireColumn({ dataset, row, column: 'code_categorie' }),
            requireColumn({ dataset, row, column: 'valeur' }),
          ]),
        ),
      ),
    )
    .map((cells) =>
      cells.flatMap(([geography, category, value]) => {
        const code = toTerritoryCode({ geography, level })
        return code === undefined ? [] : [{ code, category, value }]
      }),
    )
    .map(
      (cells) =>
        new Map(
          Object.entries(groupBy(cells, ({ code }) => code)).map(([code, territoryCells]) => [
            code,
            new Map(territoryCells.map(({ category, value }) => [category, value])),
          ]),
        ),
    )
}

function readDairyCows({
  cartostatCsv,
  level,
}: {
  cartostatCsv: string
  level: Level
}): Result<ReadonlyMap<string, string>, InvalidDataset> {
  const dataset = cartostatDataset
  return parseCsvText({ text: cartostatCsv, delimiter: ',' })
    .mapErr(toInvalidDataset(dataset))
    .andThen((rows) =>
      Result.combine(
        rows
          .filter((row) => row['maille'] === level)
          .map((row) =>
            Result.combine([
              requireColumn({ dataset, row, column: 'code' }),
              requireColumn({ dataset, row, column: 'vaches_laitieres_2020' }),
            ]),
          ),
      ),
    )
    .map((entries) => new Map(entries))
}

function toTerritoryHeadcount({
  code,
  categories,
  dairyCowsText,
}: {
  code: string
  categories: LivestockCategories
  dairyCowsText: string | undefined
}): TerritoryHeadcount {
  const parsedDairyCows = parseBig(dairyCowsText ?? SECRET_STATISTIC_MARK)
  const dairyCows = parsedDairyCows.unwrapOr(NO_DAIRY_COWS)
  const secretDairyCows = parsedDairyCows.isErr() ? [DAIRY_COWS_CELL] : []
  return {
    code,
    headcount: toLivestockHeadcount({ categories, dairyCows }),
    secretCells: [...listSecretCategories(categories), ...secretDairyCows],
  }
}

function toLevel({
  territories,
  dataset,
  keyColumn,
}: {
  territories: readonly TerritoryHeadcount[]
  dataset: string
  keyColumn: string
}): Result<LivestockHeadcountsLevel, InvalidDataset> {
  const sorted = sortBy(territories, [({ code }) => code])
  return toCsvText({
    dataset,
    columns: [keyColumn, ...HEADCOUNT_COLUMNS.map(([column]) => column)],
    rows: sorted.map(({ code, headcount }) => [
      code,
      ...HEADCOUNT_COLUMNS.map(([, select]) => select(headcount).toFixed()),
    ]),
  }).map((csv) => ({
    csv,
    territoryCount: sorted.length,
    secretCellCount: sorted.flatMap(({ secretCells }) => secretCells).length,
    totals: Object.fromEntries(
      HEADCOUNT_COLUMNS.map(([column, select]) => [
        column,
        sum(sorted.map(({ headcount }) => select(headcount))).toFixed(),
      ]),
    ),
  }))
}

function buildLevel({
  agresteCsv,
  cartostatCsv,
  level,
}: {
  agresteCsv: string
  cartostatCsv: string
  level: Level
}): Result<LivestockHeadcountsLevel, InvalidDataset> {
  const keyColumn = level === 'region' ? 'code_region' : 'code_departement'
  return Result.combine([
    readCategories({ agresteCsv, level }),
    readDairyCows({ cartostatCsv, level }),
  ]).andThen(([categoriesByCode, dairyCowsByCode]) =>
    toLevel({
      territories: [...categoriesByCode].map(([code, categories]) =>
        toTerritoryHeadcount({ code, categories, dairyCowsText: dairyCowsByCode.get(code) }),
      ),
      dataset: agresteDataset,
      keyColumn,
    }),
  )
}

function buildLivestockHeadcounts({
  agresteCsv,
  cartostatCsv,
}: {
  agresteCsv: string
  cartostatCsv: string
}): Result<LivestockHeadcounts, InvalidDataset> {
  return Result.combine([
    buildLevel({ agresteCsv, cartostatCsv, level: 'region' }),
    buildLevel({ agresteCsv, cartostatCsv, level: 'departement' }),
  ]).map(([regions, departements]) => ({ regions, departements }))
}

export { buildLivestockHeadcounts }
export type { LivestockHeadcounts }
