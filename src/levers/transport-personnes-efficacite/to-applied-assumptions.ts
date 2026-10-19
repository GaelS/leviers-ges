import type { AppliedAssumptions } from '../../application/estimate/estimate-result.ts'
import {
  BUS_PASSENGERS_PER_VEHICLE,
  ECODRIVING_POTENTIAL,
} from './calculate-transport-personnes-efficacite-reduction.ts'
import type { RailShare } from './data/resolve-rail-share.ts'
import type { TransportInputs } from './data/transport-inputs.ts'

function toRailShareAssumption(railShare: RailShare): AppliedAssumptions {
  return railShare.defaulted
    ? {
        railShare: {
          value: railShare.fraction.toFixed(),
          source:
            'SDES, Bilan annuel des transports 2024: rail share of public transport passenger-km, 82% in Île-de-France and 24% elsewhere',
          limit:
            'One value per region group: a territory with a large metro or tram network outside Île-de-France (Lyon, Marseille, Lille) has a higher rail share, so its road public transport is overestimated',
        },
      }
    : {}
}

function toFleetAssumptions(transportInputs: TransportInputs): AppliedAssumptions {
  return {
    ...(transportInputs.carFleetUnclassifiedShare.isZero()
      ? {}
      : {
          carFleetUnclassifiedShare: {
            value: transportInputs.carFleetUnclassifiedShare.toFixed(),
            source: 'SDES, parc de véhicules routiers au 1er janvier 2025',
            limit:
              'Cars with another fuel than petrol, diesel, gas or electricity have no emission factor and are left out of the fleet average',
          },
        }),
    ...(transportInputs.busFleetUnclassifiedShare.isZero()
      ? {}
      : {
          busFleetUnclassifiedShare: {
            value: transportInputs.busFleetUnclassifiedShare.toFixed(),
            source: 'SDES, parc de véhicules routiers au 1er janvier 2025',
            limit:
              'Buses and coaches running on petrol or another fuel have no emission factor and are left out of the fleet average',
          },
        }),
    ...(transportInputs.carFleetClassified.isZero()
      ? {
          nationalCarEmissionFactor: {
            value: transportInputs.carEmissionFactor.toFixed(),
            source: 'SDES, parc de véhicules routiers au 1er janvier 2025, France métropolitaine',
            limit:
              'The territory has no classified car in the fleet: the national fleet average, in kgCO2e per vehicle-km, applies',
          },
        }
      : {}),
    ...(transportInputs.busFleetClassified.isZero()
      ? {
          nationalBusEmissionFactor: {
            value: transportInputs.busEmissionFactor.toFixed(),
            source: 'SDES, parc de véhicules routiers au 1er janvier 2025, France métropolitaine',
            limit:
              'The territory has no classified bus or coach in the fleet: the national fleet average, in kgCO2e per vehicle-km, applies',
          },
        }
      : {}),
  }
}

function toAppliedAssumptions({
  transportInputs,
  railShare,
}: {
  transportInputs: TransportInputs
  railShare: RailShare
}): AppliedAssumptions {
  const busEmissionFactorPerPassengerKm = transportInputs.busEmissionFactor.dividedBy(
    BUS_PASSENGERS_PER_VEHICLE,
  )
  return {
    ecodrivingPotential: {
      value: ECODRIVING_POTENTIAL.toFixed(),
      source:
        'DonneesReference!D29 (~15%); mission-transition-ecologique.beta.gouv.fr: up to 15% of fuel',
      limit:
        'A ceiling, not an average, used for cars and for buses alike: the result is proportional to it',
    },
    busEmissionFactor: {
      value: busEmissionFactorPerPassengerKm.toFixed(),
      source:
        "OMINEA 2024 (CITEPA), Euro VI buses and coaches, low value retained, in kgCO2e per passenger-km, weighted by the territory's fleet",
      limit:
        'Base Empreinte gives 0.0874 kgCO2e per passenger-km for a diesel bus, 8.7% above the OMINEA 0.0805',
    },
    ...toRailShareAssumption(railShare),
    ...toFleetAssumptions(transportInputs),
  }
}

export { toAppliedAssumptions }
