import type BigNumber from 'bignumber.js'
import { sortBy } from 'es-toolkit'
import { Result, err, ok } from 'neverthrow'
import { sum, toBig } from '../../domain/big-number.ts'
import { invalidDataset, type InvalidDataset } from '../../domain/data-source.ts'
import { gigawattHoursToMegawattHours, quantity } from '../../domain/units.ts'
import { roundToLoaderPrecision } from '../round-to-loader-precision.ts'
import { toCsvText } from '../to-csv-text.ts'
import {
  apportionOilSales,
  type DepartmentPetroleum,
  type RegionalPetroleumMwh,
} from './apportion-oil-sales.ts'
import { buildHeatNetworks } from './build-heat-networks.ts'
import { readCerenFuelConsumption, type SheetRows } from './read-ceren-fuel-consumption.ts'
import { readDepartmentConsumption } from './read-department-consumption.ts'
import { readOilSales } from './read-oil-sales.ts'
import { readRegionalBilan, type RegionalBilan } from './read-regional-bilan.ts'

type ResidentialEnergySources = {
  readonly regionalBilanCsv: string
  readonly cerenRows: SheetRows
  readonly irisElectricityCsv: string
  readonly irisGasCsv: string
  readonly oilSalesCsv: string
  readonly heatCsv: string
}

type ControlTotals = Readonly<Record<string, string>>

type ResidentialEnergyBuild = {
  readonly regionsCsv: string
  readonly departementsCsv: string
  readonly heatNetworksCsv: string
  readonly controlTotals: {
    readonly regions: ControlTotals
    readonly departements: ControlTotals
    readonly heatNetworks: ControlTotals
  }
  readonly secretNetworkCount: number
}

type FuelShares = {
  readonly fuelOil: BigNumber
  readonly liquefiedPetroleumGas: BigNumber
}

type RegionalEnergy = {
  readonly regionCode: string
  readonly electricityGwh: string
  readonly naturalGasGwh: string
  readonly fuelOilGwh: BigNumber
  readonly liquefiedPetroleumGasGwh: BigNumber
  readonly heatGwh: string
}

type RegionRow = {
  readonly regionCode: string
  readonly electricityGwh: string
  readonly naturalGasGwh: string
  readonly fuelOilGwh: string
  readonly liquefiedPetroleumGasGwh: string
  readonly heatGwh: string
}

type DepartmentRow = {
  readonly departementCode: string
  readonly electricityMwh: string
  readonly naturalGasMwh: string
  readonly fuelOilMwh: string
  readonly liquefiedPetroleumGasMwh: string
}

const buildDataset = 'residentiel-sobriete'

// Source : data/residentiel-sobriete/manifest.json, colonnes de regions.csv
const REGIONS_COLUMNS = [
  'code_region',
  'electricity_gwh',
  'natural_gas_gwh',
  'fuel_oil_gwh',
  'lpg_gwh',
  'heat_gwh',
] as const

// Source : data/residentiel-sobriete/manifest.json, colonnes de departements.csv
const DEPARTEMENTS_COLUMNS = [
  'code_departement',
  'electricity_mwh',
  'natural_gas_mwh',
  'fuel_oil_mwh',
  'lpg_mwh',
] as const

// Source : choix de conception, non validé : un département absent des extraits IRIS d'électricité ou de gaz n'a pas de ligne, sa consommation vaut 0 (gaz : 2A, 2B et 48 en 2024)
const ABSENT_DEPARTMENT_CONSUMPTION = '0'

function toInvalidShares(detail: string): InvalidDataset {
  return invalidDataset({ dataset: buildDataset, reason: 'empty_dataset', detail })
}

function calculateFuelShares({
  fuelOilTwh,
  liquefiedPetroleumGasTwh,
}: {
  fuelOilTwh: string
  liquefiedPetroleumGasTwh: string
}): Result<FuelShares, InvalidDataset> {
  const fuelOil = toBig(fuelOilTwh)
  const liquefiedPetroleumGas = toBig(liquefiedPetroleumGasTwh)
  const total = fuelOil.plus(liquefiedPetroleumGas)
  if (total.isZero()) return err(toInvalidShares('CEREN fuel oil and LPG consumption sum to 0'))
  return ok({
    fuelOil: fuelOil.dividedBy(total),
    liquefiedPetroleumGas: liquefiedPetroleumGas.dividedBy(total),
  })
}

function toRegionalEnergy({
  bilan,
  shares,
}: {
  bilan: RegionalBilan
  shares: FuelShares
}): RegionalEnergy {
  const petroleumProductsGwh = toBig(bilan.petroleumProductsGwh)
  return {
    regionCode: bilan.regionCode,
    electricityGwh: bilan.electricityGwh,
    naturalGasGwh: bilan.naturalGasGwh,
    fuelOilGwh: petroleumProductsGwh.times(shares.fuelOil),
    liquefiedPetroleumGasGwh: petroleumProductsGwh.times(shares.liquefiedPetroleumGas),
    heatGwh: bilan.heatGwh,
  }
}

function toRegionalPetroleumMwh(regional: RegionalEnergy): RegionalPetroleumMwh {
  const fuelOilMwh = gigawattHoursToMegawattHours(quantity<'GigawattHours'>(regional.fuelOilGwh.toFixed()))
  const liquefiedPetroleumGasMwh = gigawattHoursToMegawattHours(
    quantity<'GigawattHours'>(regional.liquefiedPetroleumGasGwh.toFixed()),
  )
  return { fuelOilMwh, liquefiedPetroleumGasMwh }
}

function totalOf(values: readonly string[]): string {
  return sum(values.map((value) => toBig(value))).toFixed()
}

function toRegionRows(regionals: readonly RegionalEnergy[]): Result<readonly RegionRow[], InvalidDataset> {
  const dataset = buildDataset
  return Result.combine(
    regionals.map((regional) =>
      Result.combine([
        roundToLoaderPrecision({ dataset, column: 'fuel_oil_gwh', text: regional.fuelOilGwh.toFixed() }),
        roundToLoaderPrecision({
          dataset,
          column: 'lpg_gwh',
          text: regional.liquefiedPetroleumGasGwh.toFixed(),
        }),
      ]).map(([fuelOilGwh, liquefiedPetroleumGasGwh]) => ({
        regionCode: regional.regionCode,
        electricityGwh: regional.electricityGwh,
        naturalGasGwh: regional.naturalGasGwh,
        fuelOilGwh,
        liquefiedPetroleumGasGwh,
        heatGwh: regional.heatGwh,
      })),
    ),
  )
}

function toDepartmentRows({
  petroleum,
  electricity,
  naturalGas,
}: {
  petroleum: readonly DepartmentPetroleum[]
  electricity: ReadonlyMap<string, string>
  naturalGas: ReadonlyMap<string, string>
}): readonly DepartmentRow[] {
  return sortBy(petroleum, [({ departementCode }) => departementCode]).map(
    ({ departementCode, fuelOilMwh, liquefiedPetroleumGasMwh }) => ({
      departementCode,
      electricityMwh: electricity.get(departementCode) ?? ABSENT_DEPARTMENT_CONSUMPTION,
      naturalGasMwh: naturalGas.get(departementCode) ?? ABSENT_DEPARTMENT_CONSUMPTION,
      fuelOilMwh,
      liquefiedPetroleumGasMwh,
    }),
  )
}

function toRegionControlTotals(rows: readonly RegionRow[]): ControlTotals {
  return {
    electricity_gwh: totalOf(rows.map(({ electricityGwh }) => electricityGwh)),
    natural_gas_gwh: totalOf(rows.map(({ naturalGasGwh }) => naturalGasGwh)),
    fuel_oil_gwh: totalOf(rows.map(({ fuelOilGwh }) => fuelOilGwh)),
    lpg_gwh: totalOf(rows.map(({ liquefiedPetroleumGasGwh }) => liquefiedPetroleumGasGwh)),
    heat_gwh: totalOf(rows.map(({ heatGwh }) => heatGwh)),
  }
}

function toDepartmentControlTotals(rows: readonly DepartmentRow[]): ControlTotals {
  return {
    electricity_mwh: totalOf(rows.map(({ electricityMwh }) => electricityMwh)),
    natural_gas_mwh: totalOf(rows.map(({ naturalGasMwh }) => naturalGasMwh)),
    fuel_oil_mwh: totalOf(rows.map(({ fuelOilMwh }) => fuelOilMwh)),
    lpg_mwh: totalOf(rows.map(({ liquefiedPetroleumGasMwh }) => liquefiedPetroleumGasMwh)),
  }
}

function buildResidentialEnergy(
  sources: ResidentialEnergySources,
): Result<ResidentialEnergyBuild, InvalidDataset> {
  return Result.combine([
    readRegionalBilan(sources.regionalBilanCsv),
    readCerenFuelConsumption(sources.cerenRows).andThen(calculateFuelShares),
    readDepartmentConsumption({
      dataset: 'residentiel-sobriete/sources/sdes-electricite-iris-2024-residentiel-par-departement.csv',
      csv: sources.irisElectricityCsv,
    }),
    readDepartmentConsumption({
      dataset: 'residentiel-sobriete/sources/sdes-gaz-iris-2024-residentiel-par-departement.csv',
      csv: sources.irisGasCsv,
    }),
    readOilSales(sources.oilSalesCsv),
    buildHeatNetworks(sources.heatCsv),
  ]).andThen(([bilans, shares, electricity, naturalGas, sales, heatNetworks]) => {
    const regionals = bilans.map((bilan) => toRegionalEnergy({ bilan, shares }))
    const regionalPetroleum = new Map(
      regionals.map((regional) => [regional.regionCode, toRegionalPetroleumMwh(regional)]),
    )
    return Result.combine([
      toRegionRows(regionals),
      apportionOilSales({ sales, regionalPetroleum }),
    ]).andThen(([regionRows, petroleum]) => {
      const departmentRows = toDepartmentRows({ petroleum, electricity, naturalGas })
      return Result.combine([
        toCsvText({
          dataset: buildDataset,
          columns: REGIONS_COLUMNS,
          rows: regionRows.map((row) => [
            row.regionCode,
            row.electricityGwh,
            row.naturalGasGwh,
            row.fuelOilGwh,
            row.liquefiedPetroleumGasGwh,
            row.heatGwh,
          ]),
        }),
        toCsvText({
          dataset: buildDataset,
          columns: DEPARTEMENTS_COLUMNS,
          rows: departmentRows.map((row) => [
            row.departementCode,
            row.electricityMwh,
            row.naturalGasMwh,
            row.fuelOilMwh,
            row.liquefiedPetroleumGasMwh,
          ]),
        }),
      ]).map(([regionsCsv, departementsCsv]) => ({
        regionsCsv,
        departementsCsv,
        heatNetworksCsv: heatNetworks.csv,
        controlTotals: {
          regions: toRegionControlTotals(regionRows),
          departements: toDepartmentControlTotals(departmentRows),
          heatNetworks: { residential_delivered_mwh: heatNetworks.totalResidentialDeliveredMwh },
        },
        secretNetworkCount: heatNetworks.secretNetworkCount,
      }))
    })
  })
}

export { buildResidentialEnergy }
export type { ResidentialEnergyBuild, ResidentialEnergySources }
