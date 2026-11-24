import { getGoodsTransport } from "../../application/data/transport-marchandises/get-goods-transport.js";
import { toEstimateResult, } from "../../application/estimate/estimate-result.js";
import { calculateTransportMarchandisesReportModalReduction } from "./calculate-transport-marchandises-report-modal-reduction.js";
import { DEFAULT_CYCLOLOGISTIC_TONNE_KILOMETRES } from "./report-modal-constants.js";
import { toAppliedAssumptions } from "./to-applied-assumptions.js";
function estimate({ territory, parameters }, { dataSource }) {
    return getGoodsTransport({ dataSource, territory }).map((goodsTransport) => toEstimateResult(calculateTransportMarchandisesReportModalReduction({
        roadToRail: parameters.roadToRailFraction,
        roadToWaterway: parameters.roadToWaterwayFraction,
        tonneKilometres: goodsTransport.inputs.tonneKilometres,
        cyclologisticTonneKilometres: parameters.cyclologisticTonneKilometres ?? DEFAULT_CYCLOLOGISTIC_TONNE_KILOMETRES,
        roadEmissionFactor: goodsTransport.emissionFactors.mixed,
    }), toAppliedAssumptions({
        goodsTransport,
        cyclologisticTonneKilometres: parameters.cyclologisticTonneKilometres?.toFixed(),
    })));
}
export { estimate };
//# sourceMappingURL=estimate.js.map