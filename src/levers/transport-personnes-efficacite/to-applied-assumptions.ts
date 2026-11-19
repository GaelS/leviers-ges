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
        'Functional documentation (June 2026), 7.3.4.3, p. 61: the potential is the same for road public transport and cars, 10% by default (IPSOS survey); the spreadsheet gives ~15% (DonneesReference!D29), the documentation prevails; confirmed by the team on 2026-11-19',
      limit:
        'One average potential for cars and for buses alike: the result is proportional to it. The documentation reports a maximum of 23% of fuel for a compact petrol car and about half of the eco-driving gestures already applied',
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
