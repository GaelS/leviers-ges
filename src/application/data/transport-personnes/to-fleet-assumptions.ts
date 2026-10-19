import {
  calculateBusEmissionFactorPerPassengerKm,
  calculateCarEmissionFactorPerPassengerKm,
} from '../../../domain/vehicle-occupancy.ts'
import type { AppliedAssumptions } from '../../estimate/estimate-result.ts'
import { FLEET_SOURCE } from './fleet-source.ts'
import type { TransportInputs } from './transport-inputs.ts'

function toBusEmissionFactorAssumption(transportInputs: TransportInputs): AppliedAssumptions {
  const busEmissionFactorPerPassengerKm = calculateBusEmissionFactorPerPassengerKm(
    transportInputs.busEmissionFactor,
  )
  return {
    busEmissionFactor: {
      value: busEmissionFactorPerPassengerKm.toFixed(),
      source:
        "OMINEA 2024 (CITEPA), Euro VI buses and coaches, in kgCO2e per passenger-km, weighted by the territory's fleet. Design choice, not validated: the low value is retained",
      limit:
        'Base Empreinte gives 0.0874 kgCO2e per passenger-km for a diesel bus, 8.6% above the OMINEA 0.0805',
    },
  }
}

function toCarFleetUnclassifiedAssumption(transportInputs: TransportInputs): AppliedAssumptions {
  if (transportInputs.carFleetUnclassifiedShare.isZero()) return {}
  return {
    carFleetUnclassifiedShare: {
      value: transportInputs.carFleetUnclassifiedShare.toFixed(),
      source: FLEET_SOURCE,
      limit:
        'Cars with another fuel than petrol, diesel, gas or electricity have no emission factor and are left out of the fleet average',
    },
  }
}

function toBusFleetUnclassifiedAssumption(transportInputs: TransportInputs): AppliedAssumptions {
  if (transportInputs.busFleetUnclassifiedShare.isZero()) return {}
  return {
    busFleetUnclassifiedShare: {
      value: transportInputs.busFleetUnclassifiedShare.toFixed(),
      source: FLEET_SOURCE,
      limit:
        'Buses and coaches running on petrol or another fuel have no emission factor and are left out of the fleet average',
    },
  }
}

function toNationalCarAssumption(transportInputs: TransportInputs): AppliedAssumptions {
  if (!transportInputs.carFleetClassified.isZero()) return {}
  const carEmissionFactorPerPassengerKm = calculateCarEmissionFactorPerPassengerKm(
    transportInputs.carEmissionFactor,
  )
  return {
    nationalCarEmissionFactor: {
      value: carEmissionFactorPerPassengerKm.toFixed(),
      source: `${FLEET_SOURCE}, France métropolitaine`,
      limit:
        'The territory has no classified car in the fleet: the national fleet average applies, in kgCO2e per passenger-km',
    },
  }
}

function toNationalBusAssumption(transportInputs: TransportInputs): AppliedAssumptions {
  if (!transportInputs.busFleetClassified.isZero()) return {}
  const busEmissionFactorPerPassengerKm = calculateBusEmissionFactorPerPassengerKm(
    transportInputs.busEmissionFactor,
  )
  return {
    nationalBusEmissionFactor: {
      value: busEmissionFactorPerPassengerKm.toFixed(),
      source: `${FLEET_SOURCE}, France métropolitaine`,
      limit:
        'The territory has no classified bus or coach in the fleet: the national fleet average applies, in kgCO2e per passenger-km',
    },
  }
}

export {
  toBusEmissionFactorAssumption,
  toBusFleetUnclassifiedAssumption,
  toCarFleetUnclassifiedAssumption,
  toNationalBusAssumption,
  toNationalCarAssumption,
}
