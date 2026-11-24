import type { AppliedAssumptions } from '../../estimate/estimate-result.ts';
import type { GoodsTransport } from './get-goods-transport.ts';
declare const DISPLAYED_DECIMAL_PLACES = 6;
declare function toGoodsTransportAssumptions(goodsTransport: GoodsTransport): AppliedAssumptions;
export { DISPLAYED_DECIMAL_PLACES, toGoodsTransportAssumptions };
