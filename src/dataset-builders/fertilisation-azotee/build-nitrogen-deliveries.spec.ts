import { describe, expect, it } from 'vitest'
import { buildNitrogenDeliveries } from './build-nitrogen-deliveries.ts'

const REGION_HEADER = 'campagne,code_region,territoire,azote_total_t,produits_total_t,fichier,page_pdf'
const DEPARTEMENT_HEADER =
  'campagne,code_departement,territoire,azote_total_t,produits_total_t,fichier,page_pdf'
const REGION_COLUMNS = 'code_region,nitrogen_delivered_tonnes_2021_2022,nitrogen_delivered_tonnes_2022_2023'
const DEPARTEMENT_COLUMNS = 'code_departement,nitrogen_delivered_tonnes_2021_2022'

function toRegionCsv(...lines: string[]): string {
  return [REGION_HEADER, ...lines].join('\n')
}

function toDepartementCsv(...lines: string[]): string {
  return [DEPARTEMENT_HEADER, ...lines].join('\n')
}

function regionLine(campaign: string, code: string, tonnes: string): string {
  return `${campaign},${code},REGION,${tonnes},0,f.pdf,1`
}

function departementLine(code: string, tonnes: string): string {
  return `2021-2022,${code},DEPARTEMENT,${tonnes},0,f.pdf,1`
}

const A_REGION_CSV = toRegionCsv(
  regionLine('2021-2022', '11', '100'),
  regionLine('2022-2023', '11', '60'),
)

const A_DEPARTEMENT_CSV = toDepartementCsv(departementLine('1', '10'))

function regionsOf(regionDeliveriesCsv: string) {
  return buildNitrogenDeliveries({
    regionDeliveriesCsv,
    departementDeliveriesCsv: A_DEPARTEMENT_CSV,
  })._unsafeUnwrap().regions
}

function departementsOf(departementDeliveriesCsv: string) {
  return buildNitrogenDeliveries({
    regionDeliveriesCsv: A_REGION_CSV,
    departementDeliveriesCsv,
  })._unsafeUnwrap().departements
}

describe('buildNitrogenDeliveries, régions', () => {
  it('range les deux campagnes de chaque région, triée par code', () => {
    const regions = regionsOf(
      toRegionCsv(
        regionLine('2021-2022', '84', '30'),
        regionLine('2022-2023', '84', '31'),
        regionLine('2021-2022', '11', '10'),
        regionLine('2022-2023', '11', '11'),
      ),
    )
    expect(regions).toEqual({
      csv: `${REGION_COLUMNS}\n11,10,11\n84,30,31\n`,
      regionCount: 2,
      firstCampaignTonnes: '40',
      secondCampaignTonnes: '42',
    })
  })

  it('écarte la ligne nationale et les campagnes autres que 2021-2022 et 2022-2023', () => {
    const regions = regionsOf(
      toRegionCsv(
        '2021-2022,,France métropolitaine,999,0,f.pdf,1',
        regionLine('2020-2021', '11', '5'),
        regionLine('2021-2022', '11', '10'),
        regionLine('2022-2023', '11', '11'),
      ),
    )
    expect(regions.csv).toBe(`${REGION_COLUMNS}\n11,10,11\n`)
  })

  it('refuse une région sans l’une des deux campagnes', () => {
    expect(
      buildNitrogenDeliveries({
        regionDeliveriesCsv: toRegionCsv(regionLine('2021-2022', '11', '10')),
        departementDeliveriesCsv: A_DEPARTEMENT_CSV,
      })._unsafeUnwrapErr(),
    ).toEqual({
      kind: 'invalid_dataset',
      dataset: 'fertilisation-azotee/sources/azote-livre-par-region.csv',
      reason: 'missing_key_column',
      detail: '11 2022-2023',
    })
  })

  it('refuse des tonnes qui ne sont pas un nombre', () => {
    expect(
      buildNitrogenDeliveries({
        regionDeliveriesCsv: toRegionCsv(regionLine('2021-2022', '11', 'beaucoup')),
        departementDeliveriesCsv: A_DEPARTEMENT_CSV,
      })._unsafeUnwrapErr(),
    ).toMatchObject({ reason: 'unreadable', detail: 'azote_total_t=beaucoup is not a decimal number' })
  })

  it('refuse un relevé de régions sans colonne des tonnes', () => {
    expect(
      buildNitrogenDeliveries({
        regionDeliveriesCsv: 'campagne,code_region\n2021-2022,11',
        departementDeliveriesCsv: A_DEPARTEMENT_CSV,
      })._unsafeUnwrapErr(),
    ).toMatchObject({ reason: 'columns_mismatch' })
  })

  it('refuse un relevé de régions mal formé', () => {
    expect(
      buildNitrogenDeliveries({
        regionDeliveriesCsv: 'a,b\n1,2,3',
        departementDeliveriesCsv: A_DEPARTEMENT_CSV,
      })._unsafeUnwrapErr(),
    ).toMatchObject({
      dataset: 'fertilisation-azotee/sources/azote-livre-par-region.csv',
      reason: 'malformed_csv',
    })
  })
})

describe('buildNitrogenDeliveries, départements', () => {
  it('complète les codes sur deux chiffres et trie par code', () => {
    const departements = departementsOf(
      toDepartementCsv(departementLine('10', '5'), departementLine('1', '7'), departementLine('75', '2')),
    )
    expect(departements).toEqual({
      csv: `${DEPARTEMENT_COLUMNS}\n01,7\n10,5\n75,2\n`,
      departementCount: 3,
      tonnes: '14',
    })
  })

  it.each(['20', '99'])('écarte le code %s, qui ne se rattache à aucun département', (code) => {
    const departements = departementsOf(
      toDepartementCsv(departementLine('1', '7'), departementLine(code, '100')),
    )
    expect(departements.csv).toBe(`${DEPARTEMENT_COLUMNS}\n01,7\n`)
  })

  it('refuse des tonnes qui ne sont pas un nombre', () => {
    expect(
      buildNitrogenDeliveries({
        regionDeliveriesCsv: A_REGION_CSV,
        departementDeliveriesCsv: toDepartementCsv(departementLine('1', 'beaucoup')),
      })._unsafeUnwrapErr(),
    ).toMatchObject({ reason: 'unreadable' })
  })

  it('refuse un relevé de départements mal formé', () => {
    expect(
      buildNitrogenDeliveries({
        regionDeliveriesCsv: A_REGION_CSV,
        departementDeliveriesCsv: 'a,b\n1,2,3',
      })._unsafeUnwrapErr(),
    ).toMatchObject({
      dataset: 'fertilisation-azotee/sources/azote-livre-par-departement-2021-2022.csv',
      reason: 'malformed_csv',
    })
  })
})
