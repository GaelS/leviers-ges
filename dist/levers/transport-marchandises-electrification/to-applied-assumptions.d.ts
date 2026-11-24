import type { GoodsTransport } from '../../application/data/transport-marchandises/get-goods-transport.ts';
import type { AppliedAssumptions } from '../../application/estimate/estimate-result.ts';
import type { Fraction } from '../../domain/units.ts';
declare function toAppliedAssumptions({ goodsTransport, requestedElectrifiedShare, electrifiedShare, }: {
    goodsTransport: GoodsTransport;
    requestedElectrifiedShare: Fraction;
    electrifiedShare: Fraction;
}): AppliedAssumptions;
export { toAppliedAssumptions };
