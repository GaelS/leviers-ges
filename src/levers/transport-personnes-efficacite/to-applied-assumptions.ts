import {
  toBusEmissionFactorAssumption,
  toBusFleetUnclassifiedAssumption,
  toCarFleetUnclassifiedAssumption,
  toNationalBusAssumption,
  toNationalCarAssumption,
} from '../../application/data/transport-personnes/to-fleet-assumptions.ts'
import type { AppliedAssumptions } from '../../application/estimate/estimate-result.ts'
import { ECODRIVING_POTENTIAL } from './calculate-transport-personnes-efficacite-reduction.ts'
import type { RailShare } from '../../application/data/transport-personnes/resolve-rail-share.ts'
import { toRailShareAssumption } from '../../application/data/transport-personnes/to-rail-share-assumption.ts'
import type { TransportInputs } from '../../application/data/transport-personnes/transport-inputs.ts'

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
