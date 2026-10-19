import type BigNumber from 'bignumber.js'
import { toBig } from './big-number.ts'

// Source : SDES, « Se déplacer en voiture » (graphique 2, mobilité locale, motif « Professionnel ») : 88 % seul, 9 % à deux, 3 % à trois ou plus à 3,5 passagers, soit 0,88 × 1 + 0,09 × 2 + 0,03 × 3,5 ; DonneesReference!D26
const CAR_PASSENGERS_PER_VEHICLE: BigNumber = toBig('1.165')

// Source : DonneesReference!D28, « On prend la valeur du taux de remplissage des bus (10 personnes) indistinctement pour tous les bus et cars »
const BUS_PASSENGERS_PER_VEHICLE: BigNumber = toBig('10')

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

export {
  BUS_PASSENGERS_PER_VEHICLE,
  calculateBusEmissionFactorPerPassengerKm,
  calculateCarEmissionFactorPerPassengerKm,
  calculateEmissionFactorPerPassengerKm,
  CAR_PASSENGERS_PER_VEHICLE,
}
