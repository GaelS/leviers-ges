import { sortBy } from 'es-toolkit'
import { Result, ok } from 'neverthrow'
import { requireColumn } from '../../application/require-column.ts'
import { sum, toBig } from '../../domain/big-number.ts'
import type { DataRow, InvalidDataset } from '../../domain/data-source.ts'
import { parseCsvText } from '../../infrastructure/csv/parse-csv-text.ts'
import { toInvalidDataset } from '../../infrastructure/csv/violation.ts'
import { roundToLoaderPrecision } from '../round-to-loader-precision.ts'
import { SECRET_MARKER } from '../secret-statistic.ts'
import { toCityCode } from '../to-city-code.ts'
import { toCsvText } from '../to-csv-text.ts'

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

const sdesDataset = 'sdes-chaleur-commune-2024'
const fcuDataset = 'fcu-reseaux-chaleur'

// Source : data/reseaux-chaleur/manifest.json, colonnes de networks.csv
const NETWORKS_COLUMNS = [
  'network_id',
  'commune_code',
  'delivered_mwh',
  'emission_factor_kg_per_kwh',
  'emission_factor_source',
] as const

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

function toCsv(networks: readonly Network[]): Result<string, InvalidDataset> {
  return toCsvText({
    dataset: sdesDataset,
    columns: NETWORKS_COLUMNS,
    rows: networks.map(({ networkId, communeCode, deliveredMwh, emissionFactor, factorSource }) => [
      networkId,
      communeCode,
      deliveredMwh,
      emissionFactor,
      factorSource,
    ]),
  })
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
