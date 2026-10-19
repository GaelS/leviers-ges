import type BigNumber from 'bignumber.js'
import { sum, toBig } from '../../domain/big-number.ts'
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

// Source : TrsptPers_Efficacité, formule dessinée dans les formes de la feuille (fiche d'analyse 13) : « × 52,14 », semaines par an
const WEEKS_PER_YEAR: BigNumber = toBig('52.14')

// Source : BIPM, Le Système international d'unités (Brochure SI), 9e édition : kilo = 10^3, donc 1 t = 1 000 kg
const KILOGRAMS_PER_TONNE: BigNumber = toBig('1000')

// Source : DonneesReference!D29, « ~15% » ; la page citée, mission-transition-ecologique.beta.gouv.fr/projets-entreprise/ecoconduite, dit « jusqu'à 15 % de carburant ». Choix de conception, non validé : le même potentiel vaut pour les voitures et pour les bus et cars, le tableur n'en donne qu'un
const ECODRIVING_POTENTIAL: Fraction = quantity<'Fraction'>('0.15')

// Source : SDES, « Se déplacer en voiture » (graphique 2, mobilité locale, motif « Professionnel ») : 88 % seul, 9 % à deux, 3 % à trois ou plus à 3,5 passagers, soit 0,88 × 1 + 0,09 × 2 + 0,03 × 3,5 ; DonneesReference!D26
const CAR_PASSENGERS_PER_VEHICLE: BigNumber = toBig('1.165')

// Source : DonneesReference!D28, « On prend la valeur du taux de remplissage des bus (10 personnes) indistinctement pour tous les bus et cars »
const BUS_PASSENGERS_PER_VEHICLE: BigNumber = toBig('10')

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

function calculateEmissionFactorPerPassengerKm({
  emissionFactorPerVehicleKm,
  passengersPerVehicle,
}: {
  emissionFactorPerVehicleKm: BigNumber
  passengersPerVehicle: BigNumber
}): BigNumber {
  return emissionFactorPerVehicleKm.dividedBy(passengersPerVehicle)
}

function calculateCarEmissionFactorPerPassengerKm(carEmissionFactor: BigNumber): BigNumber {
  return calculateEmissionFactorPerPassengerKm({
    emissionFactorPerVehicleKm: carEmissionFactor,
    passengersPerVehicle: CAR_PASSENGERS_PER_VEHICLE,
  })
}

function calculateBusEmissionFactorPerPassengerKm(busEmissionFactor: BigNumber): BigNumber {
  return calculateEmissionFactorPerPassengerKm({
    emissionFactorPerVehicleKm: busEmissionFactor,
    passengersPerVehicle: BUS_PASSENGERS_PER_VEHICLE,
  })
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
  calculateBusEmissionFactorPerPassengerKm,
  calculateCarEmissionFactorPerPassengerKm,
  calculateTransportPersonnesEfficaciteReduction,
  ECODRIVING_POTENTIAL,
}
export type { EfficiencyFractions }
