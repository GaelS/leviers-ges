import type { AppliedAssumptions } from '../../application/estimate/estimate-result.ts';
import type { RailShare } from '../../application/data/transport-personnes/resolve-rail-share.ts';
import type { TransportInputs } from '../../application/data/transport-personnes/transport-inputs.ts';
declare function toAppliedAssumptions({ transportInputs, railShare, }: {
    transportInputs: TransportInputs;
    railShare: RailShare;
}): AppliedAssumptions;
export { toAppliedAssumptions };
