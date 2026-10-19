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
import type { RailEmissionFactor } from '../../application/data/transport-personnes/rail-emission-factor.ts'
import { toRailEmissionFactorAssumption } from '../../application/data/transport-personnes/to-rail-emission-factor-assumption.ts'

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
