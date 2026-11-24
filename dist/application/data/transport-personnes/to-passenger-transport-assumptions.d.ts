import type { RailShare } from './resolve-rail-share.ts';
import type { TransportInputs } from './transport-inputs.ts';
import type { AppliedAssumptions } from '../../estimate/estimate-result.ts';
import type { RailEmissionFactor } from './rail-emission-factor.ts';
declare function toPassengerTransportAssumptions({ transportInputs, railShare, railEmissionFactor, }: {
    transportInputs: TransportInputs;
    railShare: RailShare;
    railEmissionFactor: RailEmissionFactor;
}): AppliedAssumptions;
export { toPassengerTransportAssumptions };
