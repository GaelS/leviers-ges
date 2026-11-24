import type { GoodsTransport } from '../../application/data/transport-marchandises/get-goods-transport.ts';
import type { AppliedAssumptions } from '../../application/estimate/estimate-result.ts';
declare function toAppliedAssumptions(goodsTransport: GoodsTransport): AppliedAssumptions;
export { toAppliedAssumptions };
