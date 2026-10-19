import type BigNumber from 'bignumber.js'
import { sum, toBig } from '../../domain/big-number.ts'
import {
  ELECTRIC_BUS_EMISSION_FACTOR,
  ELECTRIC_CAR_EMISSION_FACTOR,
} from '../../domain/emission-factors.ts'
import {
  quantity,
  type Fraction,
  type PassengerKilometresPerWeek,
  type TonnesCo2ePerYear,
} from '../../domain/units.ts'
import {
  BUS_PASSENGERS_PER_VEHICLE,
  CAR_PASSENGERS_PER_VEHICLE,
} from '../../domain/vehicle-occupancy.ts'
import type { ThermalFleet } from './data/thermal-fleet.ts'

type ElectrificationFractions = {
  readonly carElectrification: Fraction
  readonly busElectrification: Fraction
}

type TransportFlows = {
  readonly carWeeklyPassengerKm: PassengerKilometresPerWeek
  readonly publicTransportWeeklyPassengerKm: PassengerKilometresPerWeek
}

// Source : élément neutre de la multiplication
const ONE: BigNumber = toBig('1')

// Source : TrsptPers_Efficacité, formule dessinée dans les formes de la feuille (fiche d'analyse 13) : « × 52,14 », semaines par an ; reprise à l'identique pour l'électrification
const WEEKS_PER_YEAR: BigNumber = toBig('52.14')

// Source : BIPM, Le Système international d'unités (Brochure SI), 9e édition : kilo = 10^3, donc 1 t = 1 000 kg
const KILOGRAMS_PER_TONNE: BigNumber = toBig('1000')

function calculateElectrifiedShare({
  requested,
  thermalShare,
}: {
  requested: Fraction
  thermalShare: Fraction
}): Fraction {
  return requested.isGreaterThan(thermalShare) ? thermalShare : requested
}

function calculateElectrifiedCarShare({
  fractions,
  thermalFleet,
}: {
  fractions: ElectrificationFractions
  thermalFleet: ThermalFleet
}): Fraction {
  return calculateElectrifiedShare({
    requested: fractions.carElectrification,
    thermalShare: thermalFleet.carThermalFleetShare,
  })
}

function calculateElectrifiedBusShare({
  fractions,
  thermalFleet,
}: {
  fractions: ElectrificationFractions
  thermalFleet: ThermalFleet
}): Fraction {
  return calculateElectrifiedShare({
    requested: fractions.busElectrification,
    thermalShare: thermalFleet.busThermalFleetShare,
  })
}

function calculateAvoidedEmissions({
  electrifiedShare,
  weeklyPassengerKm,
  thermalEmissionFactor,
  electricEmissionFactor,
  passengersPerVehicle,
}: {
  electrifiedShare: BigNumber
  weeklyPassengerKm: BigNumber
  thermalEmissionFactor: BigNumber
  electricEmissionFactor: BigNumber
  passengersPerVehicle: BigNumber
}): BigNumber {
  const emissionFactorGain = thermalEmissionFactor.minus(electricEmissionFactor)
  const emissionFactorGainPerPassengerKm = emissionFactorGain.dividedBy(passengersPerVehicle)
  const annualPassengerKm = weeklyPassengerKm.times(WEEKS_PER_YEAR)
  const electrifiedAnnualPassengerKm = annualPassengerKm.times(electrifiedShare)
  const avoidedEmissionsKg = electrifiedAnnualPassengerKm.times(emissionFactorGainPerPassengerKm)
  return avoidedEmissionsKg.dividedBy(KILOGRAMS_PER_TONNE)
}

function calculateTransportPersonnesElectrificationReduction({
  fractions,
  railShare,
  transportFlows,
  thermalFleet,
}: {
  fractions: ElectrificationFractions
  railShare: Fraction
  transportFlows: TransportFlows
  thermalFleet: ThermalFleet
}): TonnesCo2ePerYear {
  const roadShare = ONE.minus(railShare)
  const roadPublicTransportWeeklyPassengerKm =
    transportFlows.publicTransportWeeklyPassengerKm.times(roadShare)
  const carAvoidedEmissions = calculateAvoidedEmissions({
    electrifiedShare: calculateElectrifiedCarShare({ fractions, thermalFleet }),
    weeklyPassengerKm: transportFlows.carWeeklyPassengerKm,
    thermalEmissionFactor: thermalFleet.carThermalEmissionFactor,
    electricEmissionFactor: ELECTRIC_CAR_EMISSION_FACTOR,
    passengersPerVehicle: CAR_PASSENGERS_PER_VEHICLE,
  })
  const busAvoidedEmissions = calculateAvoidedEmissions({
    electrifiedShare: calculateElectrifiedBusShare({ fractions, thermalFleet }),
    weeklyPassengerKm: roadPublicTransportWeeklyPassengerKm,
    thermalEmissionFactor: thermalFleet.busThermalEmissionFactor,
    electricEmissionFactor: ELECTRIC_BUS_EMISSION_FACTOR,
    passengersPerVehicle: BUS_PASSENGERS_PER_VEHICLE,
  })
  return quantity<'TonnesCo2ePerYear'>(sum([carAvoidedEmissions, busAvoidedEmissions]).toFixed())
}

export {
  calculateElectrifiedBusShare,
  calculateElectrifiedCarShare,
  calculateTransportPersonnesElectrificationReduction,
}
export type { ElectrificationFractions, TransportFlows }
