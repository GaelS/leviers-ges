import type { RailShare } from '../../application/data/transport-personnes/resolve-rail-share.ts';
import type { AppliedAssumptions } from '../../application/estimate/estimate-result.ts';
import { type ElectrificationFractions } from './calculate-transport-personnes-electrification-reduction.ts';
import type { ThermalFleet } from './data/thermal-fleet.ts';
declare function toAppliedAssumptions({ fractions, thermalFleet, railShare, }: {
    fractions: ElectrificationFractions;
    thermalFleet: ThermalFleet;
    railShare: RailShare;
}): AppliedAssumptions;
export { toAppliedAssumptions };
