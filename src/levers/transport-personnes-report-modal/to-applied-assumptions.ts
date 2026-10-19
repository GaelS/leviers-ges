import type { RailShare } from '../../application/data/transport-personnes/resolve-rail-share.ts'
import {
  toBusEmissionFactorAssumption,
  toBusFleetUnclassifiedAssumption,
  toCarFleetUnclassifiedAssumption,
  toNationalBusAssumption,
  toNationalCarAssumption,
} from '../../application/data/transport-personnes/to-fleet-assumptions.ts'
import { toRailShareAssumption } from '../../application/data/transport-personnes/to-rail-share-assumption.ts'
import type { TransportInputs } from '../../application/data/transport-personnes/transport-inputs.ts'
import type { AppliedAssumptions } from '../../application/estimate/estimate-result.ts'
import type { RailEmissionFactor } from './data/rail-emission-factor.ts'

function toRailEmissionFactorAssumption(railEmissionFactor: RailEmissionFactor): AppliedAssumptions {
  return {
    railEmissionFactor: {
      value: railEmissionFactor.emissionFactor.toFixed(),
      source: railEmissionFactor.isCorsican
        ? 'Base Empreinte, Corsican passenger train, in kgCO2e per passenger-km'
        : 'Base Empreinte, TER average 2022, upstream electricity only (manufacturing 0.00479 not counted), in kgCO2e per passenger-km. Design choice, not validated',
      limit:
        'One value for all rail (metro, tram, train): a territory with a metro or tram network has its own, usually lower, factor',
    },
  }
}

function toAppliedAssumptions({
  transportInputs,
  railShare,
  railEmissionFactor,
}: {
  transportInputs: TransportInputs
  railShare: RailShare
  railEmissionFactor: RailEmissionFactor
}): AppliedAssumptions {
  return {
    ...toBusEmissionFactorAssumption(transportInputs),
    ...toRailEmissionFactorAssumption(railEmissionFactor),
    ...toRailShareAssumption(railShare),
    ...toCarFleetUnclassifiedAssumption(transportInputs),
    ...toBusFleetUnclassifiedAssumption(transportInputs),
    ...toNationalCarAssumption(transportInputs),
    ...toNationalBusAssumption(transportInputs),
  }
}

export { toAppliedAssumptions }
