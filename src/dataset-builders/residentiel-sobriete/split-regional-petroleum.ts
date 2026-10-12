import type BigNumber from 'bignumber.js'
import { err, ok, type Result } from 'neverthrow'
import { toBig } from '../../domain/big-number.ts'
import { invalidDataset, type InvalidDataset } from '../../domain/data-source.ts'
import { gigawattHoursToMegawattHours, quantity } from '../../domain/units.ts'
import type { RegionalPetroleumMwh } from './apportion-oil-sales.ts'
import type { RegionalBilan } from './read-regional-bilan.ts'

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

function toEmptyFuelSharesError(detail: string): InvalidDataset {
  return invalidDataset({ dataset: 'residentiel-sobriete', reason: 'empty_dataset', detail })
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
  if (total.isZero()) {
    return err(toEmptyFuelSharesError('CEREN fuel oil and LPG consumption sum to 0'))
  }
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

function toRegionalPetroleumMwh(regionalEnergy: RegionalEnergy): RegionalPetroleumMwh {
  const fuelOilGwh = quantity<'GigawattHours'>(regionalEnergy.fuelOilGwh.toFixed())
  const liquefiedPetroleumGasGwh = quantity<'GigawattHours'>(
    regionalEnergy.liquefiedPetroleumGasGwh.toFixed(),
  )
  return {
    fuelOilMwh: gigawattHoursToMegawattHours(fuelOilGwh),
    liquefiedPetroleumGasMwh: gigawattHoursToMegawattHours(liquefiedPetroleumGasGwh),
  }
}

export { calculateFuelShares, toRegionalEnergy, toRegionalPetroleumMwh }
export type { FuelShares, RegionalEnergy }
