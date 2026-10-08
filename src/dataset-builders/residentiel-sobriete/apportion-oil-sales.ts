import type BigNumber from 'bignumber.js'
import { Result, err } from 'neverthrow'
import { sum, toBig } from '../../domain/big-number.ts'
import { invalidDataset, type InvalidDataset } from '../../domain/data-source.ts'
import { roundToLoaderPrecision } from '../round-to-loader-precision.ts'
import type { OilSales } from './read-oil-sales.ts'

type RegionalPetroleumMwh = {
  readonly fuelOilMwh: BigNumber
  readonly liquefiedPetroleumGasMwh: BigNumber
}

type DepartmentPetroleum = {
  readonly departementCode: string
  readonly fuelOilMwh: string
  readonly liquefiedPetroleumGasMwh: string
}

const apportionDataset = 'residentiel-sobriete/departements.csv'

function toMissingRegion(regionCode: string): InvalidDataset {
  return invalidDataset({
    dataset: apportionDataset,
    reason: 'missing_key_column',
    detail: `region ${regionCode}`,
  })
}

function toEmptyRegionSales(regionCode: string): InvalidDataset {
  return invalidDataset({
    dataset: apportionDataset,
    reason: 'empty_dataset',
    detail: `no oil sales in region ${regionCode}`,
  })
}

function apportion({
  regionalMwh,
  salesQuantity,
  regionSalesTotal,
  column,
}: {
  regionalMwh: BigNumber
  salesQuantity: string
  regionSalesTotal: BigNumber
  column: string
}): Result<string, InvalidDataset> {
  const share = toBig(salesQuantity).dividedBy(regionSalesTotal)
  const departmentMwh = regionalMwh.times(share)
  return roundToLoaderPrecision({
    dataset: apportionDataset,
    column,
    text: departmentMwh.toFixed(),
  })
}

function apportionRegion({
  regionCode,
  regionSales,
  regional,
}: {
  regionCode: string
  regionSales: readonly OilSales[]
  regional: RegionalPetroleumMwh | undefined
}): Result<readonly DepartmentPetroleum[], InvalidDataset> {
  const fuelOilTotal = sum(regionSales.map(({ fuelOil }) => toBig(fuelOil)))
  const gasTotal = sum(regionSales.map(({ liquefiedPetroleumGas }) => toBig(liquefiedPetroleumGas)))
  if (regional === undefined) return err(toMissingRegion(regionCode))
  if (fuelOilTotal.isZero() || gasTotal.isZero()) return err(toEmptyRegionSales(regionCode))
  return Result.combine(
    regionSales.map((sale) =>
      Result.combine([
        apportion({
          regionalMwh: regional.fuelOilMwh,
          salesQuantity: sale.fuelOil,
          regionSalesTotal: fuelOilTotal,
          column: 'FOD',
        }),
        apportion({
          regionalMwh: regional.liquefiedPetroleumGasMwh,
          salesQuantity: sale.liquefiedPetroleumGas,
          regionSalesTotal: gasTotal,
          column: 'GPL',
        }),
      ]).map(([fuelOilMwh, liquefiedPetroleumGasMwh]) => ({
        departementCode: sale.departementCode,
        fuelOilMwh,
        liquefiedPetroleumGasMwh,
      })),
    ),
  )
}

function apportionOilSales({
  sales,
  regionalPetroleum,
}: {
  sales: readonly OilSales[]
  regionalPetroleum: ReadonlyMap<string, RegionalPetroleumMwh>
}): Result<readonly DepartmentPetroleum[], InvalidDataset> {
  const salesByRegion = Map.groupBy(sales, ({ regionCode }) => regionCode)
  return Result.combine(
    [...salesByRegion].map(([regionCode, regionSales]) =>
      apportionRegion({ regionCode, regionSales, regional: regionalPetroleum.get(regionCode) }),
    ),
  ).map((regions) => regions.flat())
}

export { apportionOilSales }
export type { DepartmentPetroleum, RegionalPetroleumMwh }
