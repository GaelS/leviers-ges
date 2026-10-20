import type BigNumber from 'bignumber.js'
import { sum, toBig } from '../../domain/big-number.ts'
import { KILOGRAMS_PER_TONNE } from '../../domain/mass-conversions.ts'
import { WEEKS_PER_YEAR } from '../../domain/transport-conversions.ts'
import {
  BUS_PASSENGERS_PER_VEHICLE,
  calculateEmissionFactorPerPassengerKm,
  CAR_PASSENGERS_PER_VEHICLE,
} from '../../domain/vehicle-occupancy.ts'
import {
  quantity,
  type Fraction,
  type KgCo2ePerVehicleKilometre,
  type PassengerKilometresPerWeek,
  type RelativeChange,
  type TonnesCo2ePerYear,
} from '../../domain/units.ts'

type EfficiencyFractions = {
  readonly carEcodrivingApplication: Fraction
  readonly busEcodrivingApplication: Fraction
  readonly carPassengerIncrease: RelativeChange
  readonly busPassengerIncrease: RelativeChange
}

type TransportFlows = {
  readonly carWeeklyPassengerKm: PassengerKilometresPerWeek
  readonly publicTransportWeeklyPassengerKm: PassengerKilometresPerWeek
  readonly carEmissionFactor: KgCo2ePerVehicleKilometre
  readonly busEmissionFactor: KgCo2ePerVehicleKilometre
}

// Source : élément neutre de la multiplication
const ONE: BigNumber = toBig('1')

// Source : DonneesReference!D29, « ~15% » ; la page citée, mission-transition-ecologique.beta.gouv.fr/projets-entreprise/ecoconduite, dit « jusqu'à 15 % de carburant ». Choix de conception, non validé : le même potentiel vaut pour les voitures et pour les bus et cars, le tableur n'en donne qu'un
const ECODRIVING_POTENTIAL: Fraction = quantity<'Fraction'>('0.15')

function calculateReductionFraction({
  ecodrivingApplication,
  passengerIncrease,
}: {
  ecodrivingApplication: Fraction
  passengerIncrease: RelativeChange
}): BigNumber {
  const increasedOccupancy = ONE.plus(passengerIncrease)
  const occupancyEffect = ONE.dividedBy(increasedOccupancy)
  const ecodrivingGain = ecodrivingApplication.times(ECODRIVING_POTENTIAL)
  const ecodrivingEffect = ONE.minus(ecodrivingGain)
  const remainingEmissions = occupancyEffect.times(ecodrivingEffect)
  return ONE.minus(remainingEmissions)
}

function calculateAvoidedEmissions({
  weeklyPassengerKm,
  emissionFactorPerVehicleKm,
  passengersPerVehicle,
  reductionFraction,
}: {
  weeklyPassengerKm: BigNumber
  emissionFactorPerVehicleKm: BigNumber
  passengersPerVehicle: BigNumber
  reductionFraction: BigNumber
}): BigNumber {
  const emissionFactorPerPassengerKm = calculateEmissionFactorPerPassengerKm({
    emissionFactorPerVehicleKm,
    passengersPerVehicle,
  })
  const annualPassengerKm = weeklyPassengerKm.times(WEEKS_PER_YEAR)
  const annualEmissionsKg = annualPassengerKm.times(emissionFactorPerPassengerKm)
  const avoidedEmissionsKg = annualEmissionsKg.times(reductionFraction)
  return avoidedEmissionsKg.dividedBy(KILOGRAMS_PER_TONNE)
}

function calculateTransportPersonnesEfficaciteReduction({
  fractions,
  railShare,
  transportInputs,
}: {
  fractions: EfficiencyFractions
  railShare: Fraction
  transportInputs: TransportFlows
}): TonnesCo2ePerYear {
  const roadShare = ONE.minus(railShare)
  const roadPublicTransportWeeklyPassengerKm =
    transportInputs.publicTransportWeeklyPassengerKm.times(roadShare)
  const carAvoidedEmissions = calculateAvoidedEmissions({
    weeklyPassengerKm: transportInputs.carWeeklyPassengerKm,
    emissionFactorPerVehicleKm: transportInputs.carEmissionFactor,
    passengersPerVehicle: CAR_PASSENGERS_PER_VEHICLE,
    reductionFraction: calculateReductionFraction({
      ecodrivingApplication: fractions.carEcodrivingApplication,
      passengerIncrease: fractions.carPassengerIncrease,
    }),
  })
  const busAvoidedEmissions = calculateAvoidedEmissions({
    weeklyPassengerKm: roadPublicTransportWeeklyPassengerKm,
    emissionFactorPerVehicleKm: transportInputs.busEmissionFactor,
    passengersPerVehicle: BUS_PASSENGERS_PER_VEHICLE,
    reductionFraction: calculateReductionFraction({
      ecodrivingApplication: fractions.busEcodrivingApplication,
      passengerIncrease: fractions.busPassengerIncrease,
    }),
  })
  return quantity<'TonnesCo2ePerYear'>(sum([carAvoidedEmissions, busAvoidedEmissions]).toFixed())
}

export {
  calculateTransportPersonnesEfficaciteReduction,
  ECODRIVING_POTENTIAL,
}
export type { EfficiencyFractions }
