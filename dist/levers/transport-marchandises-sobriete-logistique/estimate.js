import { getGoodsTransport } from "../../application/data/transport-marchandises/get-goods-transport.js";
import { toGoodsTransportAssumptions } from "../../application/data/transport-marchandises/to-goods-transport-assumptions.js";
import { toEstimateResult, } from "../../application/estimate/estimate-result.js";
import { calculateTransportMarchandisesSobrieteLogistiqueReduction } from "./calculate-transport-marchandises-sobriete-logistique-reduction.js";
function estimate({ territory, parameters }, { dataSource }) {
    return getGoodsTransport({ dataSource, territory }).map((goodsTransport) => toEstimateResult(calculateTransportMarchandisesSobrieteLogistiqueReduction({
        roadFreightReduction: parameters.roadFreightReductionFraction,
        tonneKilometres: goodsTransport.inputs.tonneKilometres,
        emissionFactor: goodsTransport.emissionFactors.mixed,
    }), toGoodsTransportAssumptions(goodsTransport)));
}
export { estimate };
//# sourceMappingURL=estimate.js.map