import { Result, err, ok } from 'neverthrow'
import { sortBy } from 'es-toolkit'
import { requireColumn } from '../../application/require-column.ts'
import { parseBig, sum, toBig } from '../../domain/big-number.ts'
import { invalidDataset, type DataRow, type InvalidDataset } from '../../domain/data-source.ts'
import { parseCsvText } from '../../infrastructure/csv/parse-csv-text.ts'
import { toInvalidDataset } from '../../infrastructure/csv/violation.ts'

type FactorSource = 'fcu' | 'sdes'

type Network = {
  readonly networkId: string
  readonly communeCode: string
  readonly deliveredMwh: string
  readonly emissionFactor: string
  readonly factorSource: FactorSource
}

type NetworksBuild = {
  readonly csv: string
  readonly networkCount: number
  readonly secretNetworkCount: number
  readonly totalDeliveredMwh: string
}

type IdentifiedRow = { readonly id: string; readonly row: DataRow }

type NetworkRecord =
  | { readonly kind: 'secret' }
  | { readonly kind: 'network'; readonly network: Network }

type DistrictRange = { readonly first: string; readonly last: string; readonly city: string }

const sdesDataset = 'sdes-chaleur-commune-2024'
const fcuDataset = 'fcu-reseaux-chaleur'

// Source : SDES, DiDo jeu 6102491997d9292269ce2d70 : la valeur « secret » remplace une livraison couverte par le secret statistique
const SECRET_MARKER = 'secret'

// Source : src/infrastructure/csv/validate-rows.ts : le chargeur CSV refuse plus de 12 décimales (excessPrecisionPattern)
const MAX_DECIMAL_PLACES = 12

// Source : data/reseaux-chaleur/manifest.json, colonnes de networks.csv
const NETWORKS_COLUMNS = [
  'network_id',
  'commune_code',
  'delivered_mwh',
  'emission_factor_kg_per_kwh',
  'emission_factor_source',
] as const

// Source : geo.api.gouv.fr, arrondissements municipaux relevés le 2026-10-07 : Paris 75101 à 75120, Lyon 69381 à 69389, Marseille 13201 à 13216, rattachés à leur commune (choix de modélisation, à valider)
const DISTRICT_RANGES: readonly DistrictRange[] = [
  { first: '75101', last: '75120', city: '75056' },
  { first: '69381', last: '69389', city: '69123' },
  { first: '13201', last: '13216', city: '13055' },
]

// Source : Insee, code officiel géographique : un code de commune ou d'arrondissement numérique compte 5 chiffres
const NUMERIC_COMMUNE_CODE = /^\d{5}$/

// Source : RFC 4180 : ces caractères obligent à protéger un champ, que ce générateur ne sait pas faire
const UNSAFE_CSV_FIELD = /[",\r\n]/

function roundToLoaderPrecision({
  dataset,
  column,
  text,
}: {
  dataset: string
  column: string
  text: string
}): Result<string, InvalidDataset> {
  return parseBig(text)
    .map((value) => value.decimalPlaces(MAX_DECIMAL_PLACES).toFixed())
    .mapErr(() =>
      invalidDataset({
        dataset,
        reason: 'unreadable',
        detail: `${column}=${text} is not a decimal number`,
      }),
    )
}

function toCityCode(communeCode: string): string {
  if (!NUMERIC_COMMUNE_CODE.test(communeCode)) return communeCode
  const range = DISTRICT_RANGES.find(
    ({ first, last }) => first <= communeCode && communeCode <= last,
  )
  return range?.city ?? communeCode
}

function readFcuFactors(fcuCsv: string): Result<ReadonlyMap<string, string>, InvalidDataset> {
  const dataset = fcuDataset
  return parseCsvText({ text: fcuCsv, delimiter: ',' })
    .mapErr(toInvalidDataset(dataset))
    .andThen((rows) =>
      Result.combine(
        rows.map((row) =>
          Result.combine([
            requireColumn({ dataset, row, column: 'identifiant_reseau' }),
            requireColumn({ dataset, row, column: 'contenu_co2_kgco2_kwh' }),
          ]),
        ),
      ),
    )
    .map((pairs) => new Map(pairs.filter(([networkId]) => networkId !== '')))
}

function resolveEmissionFactor({
  row,
  networkId,
  fcuFactors,
}: {
  row: DataRow
  networkId: string
  fcuFactors: ReadonlyMap<string, string>
}): Result<{ emissionFactor: string; factorSource: FactorSource }, InvalidDataset> {
  const fcuFactor = fcuFactors.get(networkId)
  if (fcuFactor !== undefined && fcuFactor !== '') {
    return roundToLoaderPrecision({
      dataset: fcuDataset,
      column: 'contenu_co2_kgco2_kwh',
      text: fcuFactor,
    }).map((emissionFactor) => ({ emissionFactor, factorSource: 'fcu' }))
  }
  return requireColumn({ dataset: sdesDataset, row, column: 'CONTENU_EN_CO2' })
    .andThen((text) =>
      roundToLoaderPrecision({ dataset: sdesDataset, column: 'CONTENU_EN_CO2', text }),
    )
    .map((emissionFactor) => ({ emissionFactor, factorSource: 'sdes' }))
}

function toNetworkRecord({
  id,
  row,
  fcuFactors,
}: IdentifiedRow & { fcuFactors: ReadonlyMap<string, string> }): Result<NetworkRecord, InvalidDataset> {
  const dataset = sdesDataset
  return Result.combine([
    requireColumn({ dataset, row, column: 'COMMUNE_CODE' }),
    requireColumn({ dataset, row, column: 'CONSOTOT' }),
  ]).andThen(([communeCode, consumption]): Result<NetworkRecord, InvalidDataset> => {
    if (consumption === SECRET_MARKER) return ok({ kind: 'secret' })
    return Result.combine([
      roundToLoaderPrecision({ dataset, column: 'CONSOTOT', text: consumption }),
      resolveEmissionFactor({ row, networkId: id, fcuFactors }),
    ]).map(([deliveredMwh, { emissionFactor, factorSource }]) => ({
      kind: 'network',
      network: {
        networkId: id,
        communeCode: toCityCode(communeCode),
        deliveredMwh,
        emissionFactor,
        factorSource,
      },
    }))
  })
}

function readNetworkRecords({
  sdesCsv,
  fcuFactors,
}: {
  sdesCsv: string
  fcuFactors: ReadonlyMap<string, string>
}): Result<readonly NetworkRecord[], InvalidDataset> {
  const dataset = sdesDataset
  return parseCsvText({ text: sdesCsv, delimiter: ';' })
    .mapErr(toInvalidDataset(dataset))
    .andThen((rows) =>
      Result.combine(
        rows.map((row) => requireColumn({ dataset, row, column: 'ID' }).map((id) => ({ id, row }))),
      ),
    )
    .map((shaped) => sortBy(shaped, [({ id }) => id]))
    .andThen((sorted) =>
      Result.combine(sorted.map((shapedRow) => toNetworkRecord({ ...shapedRow, fcuFactors }))),
    )
}

function toCsvLine(fields: readonly string[]): Result<string, InvalidDataset> {
  const unsafeField = fields.find((field) => UNSAFE_CSV_FIELD.test(field))
  return unsafeField === undefined
    ? ok(fields.join(','))
    : err(
        invalidDataset({
          dataset: sdesDataset,
          reason: 'malformed_csv',
          detail: `field ${unsafeField} needs CSV quoting`,
        }),
      )
}

function toCsv(networks: readonly Network[]): Result<string, InvalidDataset> {
  const lines = [
    NETWORKS_COLUMNS,
    ...networks.map(({ networkId, communeCode, deliveredMwh, emissionFactor, factorSource }) => [
      networkId,
      communeCode,
      deliveredMwh,
      emissionFactor,
      factorSource,
    ]),
  ]
  return Result.combine(lines.map(toCsvLine)).map((csvLines) => `${csvLines.join('\n')}\n`)
}

function buildNetworks({
  sdesCsv,
  fcuCsv,
}: {
  sdesCsv: string
  fcuCsv: string
}): Result<NetworksBuild, InvalidDataset> {
  return readFcuFactors(fcuCsv)
    .andThen((fcuFactors) => readNetworkRecords({ sdesCsv, fcuFactors }))
    .andThen((records) => {
      const networks = records.flatMap((record) =>
        record.kind === 'network' ? [record.network] : [],
      )
      const totalDeliveredMwh = sum(networks.map(({ deliveredMwh }) => toBig(deliveredMwh)))
      return toCsv(networks).map((csv) => ({
        csv,
        networkCount: networks.length,
        secretNetworkCount: records.filter(({ kind }) => kind === 'secret').length,
        totalDeliveredMwh: totalDeliveredMwh.toFixed(),
      }))
    })
}

export { buildNetworks }
export type { NetworksBuild }
