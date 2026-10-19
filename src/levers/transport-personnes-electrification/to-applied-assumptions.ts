import type { RailShare } from '../../application/data/transport-personnes/resolve-rail-share.ts'
import { toRailShareAssumption } from '../../application/data/transport-personnes/to-rail-share-assumption.ts'
import { FLEET_SOURCE } from '../../application/data/transport-personnes/fleet-source.ts'
import type { AppliedAssumptions } from '../../application/estimate/estimate-result.ts'
import {
  ELECTRIC_BUS_EMISSION_FACTOR,
  ELECTRIC_CAR_EMISSION_FACTOR,
} from '../../domain/emission-factors.ts'
import {
  calculateElectrifiedBusShare,
  calculateElectrifiedCarShare,
  type ElectrificationFractions,
} from './calculate-transport-personnes-electrification-reduction.ts'
import type { ThermalFleet } from './data/thermal-fleet.ts'

function toElectricCarEmissionFactorAssumption(): AppliedAssumptions {
  return {
    electricCarEmissionFactor: {
      value: ELECTRIC_CAR_EMISSION_FACTOR.toFixed(),
      source:
        'Fiche d’analyse 11, OMINEA v23.1 trial calculation, in kgCO2e per vehicle-km: upstream electricity only, no tailpipe emission',
      limit:
        'Every electrified car is counted at the same factor, whatever the electricity mix of the territory',
    },
  }
}

function toElectricBusEmissionFactorAssumption(): AppliedAssumptions {
  return {
    electricBusEmissionFactor: {
      value: ELECTRIC_BUS_EMISSION_FACTOR.toFixed(),
      source:
        'Base Empreinte, 0.0095 kgCO2e per passenger-km, times the 10 passengers of the occupancy rate, in kgCO2e per vehicle-km: upstream electricity only, no tailpipe emission',
      limit:
        'Every electrified bus or coach is counted at the same factor, whatever the electricity mix of the territory',
    },
  }
}

function toCarElectrificationCapAssumption({
  fractions,
  thermalFleet,
}: {
  fractions: ElectrificationFractions
  thermalFleet: ThermalFleet
}): AppliedAssumptions {
  const electrifiedShare = calculateElectrifiedCarShare({ fractions, thermalFleet })
  if (electrifiedShare.isEqualTo(fractions.carElectrification)) return {}
  return {
    carElectrificationFraction: {
      value: electrifiedShare.toFixed(),
      source: `${FLEET_SOURCE}, share of cars running on petrol, diesel or gas`,
      limit:
        'The requested share exceeds the share of thermal cars in the fleet: only thermal cars can be electrified, the requested share is capped',
    },
  }
}

function toBusElectrificationCapAssumption({
  fractions,
  thermalFleet,
}: {
  fractions: ElectrificationFractions
  thermalFleet: ThermalFleet
}): AppliedAssumptions {
  const electrifiedShare = calculateElectrifiedBusShare({ fractions, thermalFleet })
  if (electrifiedShare.isEqualTo(fractions.busElectrification)) return {}
  return {
    busElectrificationFraction: {
      value: electrifiedShare.toFixed(),
      source: `${FLEET_SOURCE}, share of buses and coaches running on diesel or gas`,
      limit:
        'The requested share exceeds the share of thermal buses and coaches in the fleet: only thermal buses and coaches can be electrified, the requested share is capped',
    },
  }
}

function toAppliedAssumptions({
  fractions,
  thermalFleet,
  railShare,
}: {
  fractions: ElectrificationFractions
  thermalFleet: ThermalFleet
  railShare: RailShare
}): AppliedAssumptions {
  return {
    ...toElectricCarEmissionFactorAssumption(),
    ...toElectricBusEmissionFactorAssumption(),
    ...toRailShareAssumption(railShare),
    ...toCarElectrificationCapAssumption({ fractions, thermalFleet }),
    ...toBusElectrificationCapAssumption({ fractions, thermalFleet }),
  }
}

export { toAppliedAssumptions }
