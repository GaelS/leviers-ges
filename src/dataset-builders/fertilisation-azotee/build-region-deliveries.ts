import { groupBy, sortBy } from 'es-toolkit'
import { Result, err, ok } from 'neverthrow'
import { requireColumn } from '../../application/require-column.ts'
import { sum, toBig } from '../../domain/big-number.ts'
import { invalidDataset, type DataRow, type InvalidDataset } from '../../domain/data-source.ts'
import { parseCsvText } from '../../infrastructure/csv/parse-csv-text.ts'
import { toInvalidDataset } from '../../infrastructure/csv/violation.ts'
import { roundToLoaderPrecision } from '../round-to-loader-precision.ts'
import { toCsvText } from '../to-csv-text.ts'

type RegionDeliveries = {
  readonly csv: string
  readonly regionCount: number
  readonly firstCampaignTonnes: string
  readonly secondCampaignTonnes: string
}

type RegionLine = {
  readonly regionCode: string
  readonly firstCampaignTonnes: string
  readonly secondCampaignTonnes: string
}

type RegionCampaign = {
  readonly regionCode: string
  readonly campaign: string
  readonly tonnes: string
}

const regionDeliveriesDataset = 'fertilisation-azotee/sources/azote-livre-par-region.csv'

// Source : data/fertilisation-azotee/manifest.json, colonnes de regions.csv
const REGION_COLUMNS = [
  'code_region',
  'nitrogen_delivered_tonnes_2021_2022',
  'nitrogen_delivered_tonnes_2022_2023',
] as const

// Source : hypothèse nommée nitrogenCampaigns (docs/methodology/assumptions.md) : région, moyenne des campagnes 2021-2022 et 2022-2023 ; DonneesTerritoires!D8 : « Prendre la moyenne sur 2 ans »
const FIRST_CAMPAIGN = '2021-2022'

// Source : hypothèse nommée nitrogenCampaigns (docs/methodology/assumptions.md) : 2022-2023 est la dernière campagne publiée par région (2023-2024 et 2024-2025 ne le sont qu'au national)
const SECOND_CAMPAIGN = '2022-2023'

function toRegionCampaign(row: DataRow): Result<RegionCampaign, InvalidDataset> {
  const dataset = regionDeliveriesDataset
  return Result.combine([
    requireColumn({ dataset, row, column: 'code_region' }),
    requireColumn({ dataset, row, column: 'campagne' }),
    requireColumn({ dataset, row, column: 'azote_total_t' }).andThen((text) =>
      roundToLoaderPrecision({ dataset, column: 'azote_total_t', text }),
    ),
  ]).map(([regionCode, campaign, tonnes]) => ({ regionCode, campaign, tonnes }))
}

function tonnesOf({
  regionCode,
  campaigns,
  campaign,
}: {
  regionCode: string
  campaigns: readonly RegionCampaign[]
  campaign: string
}): Result<string, InvalidDataset> {
  const found = campaigns.find((candidate) => candidate.campaign === campaign)
  if (found !== undefined) return ok(found.tonnes)
  return err(
    invalidDataset({
      dataset: regionDeliveriesDataset,
      reason: 'missing_key_column',
      detail: `${regionCode} ${campaign}`,
    }),
  )
}

function toRegionLine({
  regionCode,
  campaigns,
}: {
  regionCode: string
  campaigns: readonly RegionCampaign[]
}): Result<RegionLine, InvalidDataset> {
  return Result.combine([
    tonnesOf({ regionCode, campaigns, campaign: FIRST_CAMPAIGN }),
    tonnesOf({ regionCode, campaigns, campaign: SECOND_CAMPAIGN }),
  ]).map(([firstCampaignTonnes, secondCampaignTonnes]) => ({
    regionCode,
    firstCampaignTonnes,
    secondCampaignTonnes,
  }))
}

function buildRegionDeliveries(
  regionDeliveriesCsv: string,
): Result<RegionDeliveries, InvalidDataset> {
  return parseCsvText({ text: regionDeliveriesCsv, delimiter: ',' })
    .mapErr(toInvalidDataset(regionDeliveriesDataset))
    .andThen((rows) => Result.combine(rows.map(toRegionCampaign)))
    .map((campaigns) => campaigns.filter(({ regionCode }) => regionCode !== ''))
    .andThen((regional) =>
      Result.combine(
        Object.entries(groupBy(regional, ({ regionCode }) => regionCode)).map(
          ([regionCode, campaigns]) => toRegionLine({ regionCode, campaigns }),
        ),
      ),
    )
    .map((lines) => sortBy(lines, [({ regionCode }) => regionCode]))
    .andThen((lines) =>
      toCsvText({
        dataset: regionDeliveriesDataset,
        columns: REGION_COLUMNS,
        rows: lines.map(({ regionCode, firstCampaignTonnes, secondCampaignTonnes }) => [
          regionCode,
          firstCampaignTonnes,
          secondCampaignTonnes,
        ]),
      }).map((csv) => ({
        csv,
        regionCount: lines.length,
        firstCampaignTonnes: sum(lines.map((line) => toBig(line.firstCampaignTonnes))).toFixed(),
        secondCampaignTonnes: sum(lines.map((line) => toBig(line.secondCampaignTonnes))).toFixed(),
      })),
    )
}

export { buildRegionDeliveries }
export type { RegionDeliveries }
