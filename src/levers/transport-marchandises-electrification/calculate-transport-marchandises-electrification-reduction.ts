import type BigNumber from 'bignumber.js'
import { toBig } from '../../domain/big-number.ts'
import { KILOGRAMS_PER_TONNE } from '../../domain/mass-conversions.ts'
import {
  quantity,
  type Fraction,
  type KgCo2ePerTonneKilometre,
  type TonneKilometres,
  type TonnesCo2ePerYear,
} from '../../domain/units.ts'

// Source : élément neutre de la multiplication
const ONE: BigNumber = toBig('1')

function calculateThermalShare(zeroEmissionShare: Fraction): Fraction {
  return quantity<'Fraction'>(ONE.minus(zeroEmissionShare).toFixed())
}

function calculateElectrifiedShare({
  requested,
  zeroEmissionShare,
}: {
  requested: Fraction
  zeroEmissionShare: Fraction
}): Fraction {
  const thermalShare = calculateThermalShare(zeroEmissionShare)
  return requested.isGreaterThan(thermalShare) ? thermalShare : requested
}

function calculateTransportMarchandisesElectrificationReduction({
  electrifiedShare,
  tonneKilometres,
  thermalEmissionFactor,
  electricEmissionFactor,
}: {
  electrifiedShare: Fraction
  tonneKilometres: TonneKilometres
  thermalEmissionFactor: KgCo2ePerTonneKilometre
  electricEmissionFactor: KgCo2ePerTonneKilometre
}): TonnesCo2ePerYear {
  const electrifiedTonneKilometres = tonneKilometres.times(electrifiedShare)
  const emissionFactorGap = thermalEmissionFactor.minus(electricEmissionFactor)
  const avoidedEmissionsKg = electrifiedTonneKilometres.times(emissionFactorGap)
  return quantity<'TonnesCo2ePerYear'>(avoidedEmissionsKg.dividedBy(KILOGRAMS_PER_TONNE).toFixed())
}

export {
  calculateElectrifiedShare,
  calculateThermalShare,
  calculateTransportMarchandisesElectrificationReduction,
}
