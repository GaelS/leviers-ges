import type { AppliedAssumptions } from '../../application/estimate/estimate-result.ts'
import {
  calculateBusEmissionFactorPerPassengerKm,
  calculateCarEmissionFactorPerPassengerKm,
  ECODRIVING_POTENTIAL,
} from './calculate-transport-personnes-efficacite-reduction.ts'
import type { RailShare } from '../../application/data/transport-personnes/resolve-rail-share.ts'
import { toRailShareAssumption } from '../../application/data/transport-personnes/to-rail-share-assumption.ts'
import type { TransportInputs } from '../../application/data/transport-personnes/transport-inputs.ts'

const fleetSource = 'SDES, parc de véhicules routiers au 1er janvier 2025'

function toEcodrivingPotentialAssumption(): AppliedAssumptions {
  return {
    ecodrivingPotential: {
      value: ECODRIVING_POTENTIAL.toFixed(),
      source:
        'DonneesReference!D29 (~15%); mission-transition-ecologique.beta.gouv.fr: up to 15% of fuel. Design choice, not validated: the same potential for cars and buses',
      limit:
        'A ceiling, not an average, used for cars and for buses alike: the result is proportional to it',
    },
  }
}

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
      source: fleetSource,
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
      source: fleetSource,
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
      source: `${fleetSource}, France métropolitaine`,
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
      source: `${fleetSource}, France métropolitaine`,
      limit:
        'The territory has no classified bus or coach in the fleet: the national fleet average applies, in kgCO2e per passenger-km',
    },
  }
}

function toAppliedAssumptions({
  transportInputs,
  railShare,
}: {
  transportInputs: TransportInputs
  railShare: RailShare
}): AppliedAssumptions {
  return {
    ...toEcodrivingPotentialAssumption(),
    ...toBusEmissionFactorAssumption(transportInputs),
    ...toRailShareAssumption(railShare),
    ...toCarFleetUnclassifiedAssumption(transportInputs),
    ...toBusFleetUnclassifiedAssumption(transportInputs),
    ...toNationalCarAssumption(transportInputs),
    ...toNationalBusAssumption(transportInputs),
  }
}

export { toAppliedAssumptions }
