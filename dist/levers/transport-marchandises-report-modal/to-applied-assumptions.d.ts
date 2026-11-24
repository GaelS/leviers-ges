import type { GoodsTransport } from '../../application/data/transport-marchandises/get-goods-transport.ts';
import type { AppliedAssumptions } from '../../application/estimate/estimate-result.ts';
declare function toAppliedAssumptions({ goodsTransport, cyclologisticTonneKilometres, }: {
    goodsTransport: GoodsTransport;
    cyclologisticTonneKilometres: string | undefined;
}): AppliedAssumptions;
export { toAppliedAssumptions };
