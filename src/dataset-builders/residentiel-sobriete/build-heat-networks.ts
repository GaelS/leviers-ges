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

type HeatNetwork = {
  readonly networkId: string
  readonly communeCode: string
  readonly residentialDeliveredMwh: string
  readonly emissionFactor: string
}

type HeatNetworksBuild = {
  readonly csv: string
  readonly networkCount: number
  readonly secretNetworkCount: number
  readonly totalResidentialDeliveredMwh: string
}

type HeatNetworkRecord =
  | { readonly kind: 'secret' }
  | { readonly kind: 'network'; readonly network: HeatNetwork }

const heatDataset = 'residentiel-sobriete/sources/sdes-chaleur-commune-2024.csv'

// Source : data/residentiel-sobriete/manifest.json, colonnes de heat-networks.csv
const HEAT_NETWORKS_COLUMNS = [
  'network_id',
  'commune_code',
  'residential_delivered_mwh',
  'emission_factor_kg_per_kwh',
] as const

function toHeatNetworkRecord(row: DataRow): Result<HeatNetworkRecord, InvalidDataset> {
  const dataset = heatDataset
  return Result.combine([
    requireColumn({ dataset, row, column: 'ID' }),
    requireColumn({ dataset, row, column: 'COMMUNE_CODE' }),
    requireColumn({ dataset, row, column: 'CONSOR' }),
    requireColumn({ dataset, row, column: 'CONTENU_EN_CO2' }),
  ]).andThen(([networkId, communeCode, residentialConsumption, carbonContent]) => {
    if (residentialConsumption === SECRET_MARKER) {
      return ok<HeatNetworkRecord, InvalidDataset>({ kind: 'secret' })
    }
    return Result.combine([
      roundToLoaderPrecision({ dataset, column: 'CONSOR', text: residentialConsumption }),
      roundToLoaderPrecision({ dataset, column: 'CONTENU_EN_CO2', text: carbonContent }),
    ]).map(
      ([residentialDeliveredMwh, emissionFactor]): HeatNetworkRecord => ({
        kind: 'network',
        network: {
          networkId,
          communeCode: toCityCode(communeCode),
          residentialDeliveredMwh,
          emissionFactor,
        },
      }),
    )
  })
}

function toCsv(networks: readonly HeatNetwork[]): Result<string, InvalidDataset> {
  return toCsvText({
    dataset: heatDataset,
    columns: HEAT_NETWORKS_COLUMNS,
    rows: sortBy(networks, [({ networkId }) => networkId]).map(
      ({ networkId, communeCode, residentialDeliveredMwh, emissionFactor }) => [
        networkId,
        communeCode,
        residentialDeliveredMwh,
        emissionFactor,
      ],
    ),
  })
}

function buildHeatNetworks(heatCsv: string): Result<HeatNetworksBuild, InvalidDataset> {
  return parseCsvText({ text: heatCsv, delimiter: ';' })
    .mapErr(toInvalidDataset(heatDataset))
    .andThen((rows) => Result.combine(rows.map(toHeatNetworkRecord)))
    .andThen((records) => {
      const networks = records.flatMap((record) =>
        record.kind === 'network' ? [record.network] : [],
      )
      const totalResidentialDeliveredMwh = sum(
        networks.map(({ residentialDeliveredMwh }) => toBig(residentialDeliveredMwh)),
      )
      return toCsv(networks).map((csv) => ({
        csv,
        networkCount: networks.length,
        secretNetworkCount: records.filter(({ kind }) => kind === 'secret').length,
        totalResidentialDeliveredMwh: totalResidentialDeliveredMwh.toFixed(),
      }))
    })
}

export { buildHeatNetworks }
export type { HeatNetworksBuild }
