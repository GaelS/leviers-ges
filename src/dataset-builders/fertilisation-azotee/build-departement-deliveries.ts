import { sortBy } from 'es-toolkit'
import { Result } from 'neverthrow'
import { requireColumn } from '../../application/require-column.ts'
import { sum, toBig } from '../../domain/big-number.ts'
import type { DataRow, InvalidDataset } from '../../domain/data-source.ts'
import { parseCsvText } from '../../infrastructure/csv/parse-csv-text.ts'
import { toInvalidDataset } from '../../infrastructure/csv/violation.ts'
import { roundToLoaderPrecision } from '../round-to-loader-precision.ts'
import { toCsvText } from '../to-csv-text.ts'

type DepartementDeliveries = {
  readonly csv: string
  readonly departementCount: number
  readonly tonnes: string
}

type DepartementDelivery = readonly [string, string]

const departementDeliveriesDataset =
  'fertilisation-azotee/sources/azote-livre-par-departement-2021-2022.csv'

// Source : data/fertilisation-azotee/manifest.json, colonnes de departements.csv
const DEPARTEMENT_COLUMNS = ['code_departement', 'nitrogen_delivered_tonnes_2021_2022'] as const

// Source : France Fertilisants, livraisons 2021-2022 par département : la Corse est publiée sous le code 20 sans distinguer 2A et 2B, et la page « Région parisienne » (99) regroupe des départements déjà comptés (choix de conception, non validé)
const UNSPLITTABLE_DEPARTEMENT_CODES: ReadonlySet<string> = new Set(['20', '99'])

// Source : Insee, code officiel géographique : un code de département métropolitain numérique compte 2 chiffres, complété à gauche par un zéro
const DEPARTEMENT_CODE_PADDING = '0'

// Source : Insee, code officiel géographique : un code de département métropolitain numérique compte 2 chiffres
const DEPARTEMENT_CODE_LENGTH = 2

function toDelivery(row: DataRow): Result<DepartementDelivery, InvalidDataset> {
  const dataset = departementDeliveriesDataset
  return Result.combine([
    requireColumn({ dataset, row, column: 'code_departement' }),
    requireColumn({ dataset, row, column: 'azote_total_t' }).andThen((text) =>
      roundToLoaderPrecision({ dataset, column: 'azote_total_t', text }),
    ),
  ]).map(([code, tonnes]) => [code.padStart(DEPARTEMENT_CODE_LENGTH, DEPARTEMENT_CODE_PADDING), tonnes])
}

function buildDepartementDeliveries(
  departementDeliveriesCsv: string,
): Result<DepartementDeliveries, InvalidDataset> {
  return parseCsvText({ text: departementDeliveriesCsv, delimiter: ',' })
    .mapErr(toInvalidDataset(departementDeliveriesDataset))
    .andThen((rows) => Result.combine(rows.map(toDelivery)))
    .map((deliveries) =>
      deliveries.filter(([code]) => !UNSPLITTABLE_DEPARTEMENT_CODES.has(code)),
    )
    .map((deliveries) => sortBy(deliveries, [([code]) => code]))
    .andThen((deliveries) =>
      toCsvText({
        dataset: departementDeliveriesDataset,
        columns: DEPARTEMENT_COLUMNS,
        rows: deliveries,
      }).map((csv) => ({
        csv,
        departementCount: deliveries.length,
        tonnes: sum(deliveries.map(([, tonnes]) => toBig(tonnes))).toFixed(),
      })),
    )
}

export { buildDepartementDeliveries }
export type { DepartementDeliveries }
