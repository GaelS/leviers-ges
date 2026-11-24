import { getGoodsTransport } from "../../application/data/transport-marchandises/get-goods-transport.js";
import { toEstimateResult, } from "../../application/estimate/estimate-result.js";
import { calculateTransportMarchandisesEfficaciteReduction } from "./calculate-transport-marchandises-efficacite-reduction.js";
import { toAppliedAssumptions } from "./to-applied-assumptions.js";
function estimate({ territory, parameters }, { dataSource }) {
    return getGoodsTransport({ dataSource, territory }).map((goodsTransport) => toEstimateResult(calculateTransportMarchandisesEfficaciteReduction({
        ecodrivingApplication: parameters.ecodrivingApplicationFraction,
        loadFactorIncrease: parameters.loadFactorIncrease,
        tonneKilometres: goodsTransport.inputs.tonneKilometres,
        emissionFactor: goodsTransport.emissionFactors.mixed,
    }), toAppliedAssumptions(goodsTransport)));
}
export { estimate };
//# sourceMappingURL=estimate.js.map