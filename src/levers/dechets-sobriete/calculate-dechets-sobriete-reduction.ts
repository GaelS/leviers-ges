import type BigNumber from 'bignumber.js'
import { sum } from '../../domain/big-number.ts'
import { KILOGRAMS_PER_TONNE } from '../../domain/mass-conversions.ts'
import { quantity, type Fraction, type TonnesCo2ePerYear } from '../../domain/units.ts'
import { NO_EMISSIONS_KG, type WasteTypeTreatment } from '../../domain/waste-treatment.ts'

type WasteReductions = {
  readonly storage: Fraction
  readonly incineration: Fraction
}

function calculateStorageReductionKg({
  reduction,
  wasteType,
}: {
  reduction: Fraction
  wasteType: WasteTypeTreatment
}): BigNumber {
  const { storageTonnes, storageEmissionFactor } = wasteType
  if (storageEmissionFactor === undefined) return NO_EMISSIONS_KG
  const reducedTonnes = storageTonnes.times(reduction)
  return reducedTonnes.times(storageEmissionFactor)
}

function calculateIncinerationReductionKg({
  reduction,
  wasteType,
}: {
  reduction: Fraction
  wasteType: WasteTypeTreatment
}): BigNumber {
  const { incinerationTonnes, incinerationEmissionFactor } = wasteType
  if (incinerationEmissionFactor === undefined) return NO_EMISSIONS_KG
  const reducedTonnes = incinerationTonnes.times(reduction)
  return reducedTonnes.times(incinerationEmissionFactor)
}

function calculateWasteTypeAvoidedKg({
  reductions,
  wasteType,
}: {
  reductions: WasteReductions
  wasteType: WasteTypeTreatment
}): BigNumber {
  const storageReductionKg = calculateStorageReductionKg({
    reduction: reductions.storage,
    wasteType,
  })
  const incinerationReductionKg = calculateIncinerationReductionKg({
    reduction: reductions.incineration,
    wasteType,
  })
  return sum([storageReductionKg, incinerationReductionKg])
}

function calculateDechetsSobrieteReduction({
  reductions,
  wasteTypes,
}: {
  reductions: WasteReductions
  wasteTypes: readonly WasteTypeTreatment[]
}): TonnesCo2ePerYear {
  const avoidedKg = sum(
    wasteTypes.map((wasteType) => calculateWasteTypeAvoidedKg({ reductions, wasteType })),
  )
  return quantity<'TonnesCo2ePerYear'>(avoidedKg.dividedBy(KILOGRAMS_PER_TONNE).toFixed())
}

export { calculateDechetsSobrieteReduction }
export type { WasteReductions }
