import { getGoodsTransport } from "../../application/data/transport-marchandises/get-goods-transport.js";
import { toEstimateResult, } from "../../application/estimate/estimate-result.js";
import { ELECTRIC_HEAVY_VEHICLE_EMISSION_FACTOR } from "../../domain/heavy-vehicle-emission-factor.js";
import { calculateElectrifiedShare, calculateTransportMarchandisesElectrificationReduction, } from "./calculate-transport-marchandises-electrification-reduction.js";
import { toAppliedAssumptions } from "./to-applied-assumptions.js";
function estimate({ territory, parameters }, { dataSource }) {
    return getGoodsTransport({ dataSource, territory }).map((goodsTransport) => {
        const requestedElectrifiedShare = parameters.additionalElectrifiedFleetFraction;
        const electrifiedShare = calculateElectrifiedShare({
            requested: requestedElectrifiedShare,
            zeroEmissionShare: goodsTransport.emissionFactors.zeroEmissionShare,
        });
        return toEstimateResult(calculateTransportMarchandisesElectrificationReduction({
            electrifiedShare,
            tonneKilometres: goodsTransport.inputs.tonneKilometres,
            thermalEmissionFactor: goodsTransport.emissionFactors.thermal,
            electricEmissionFactor: ELECTRIC_HEAVY_VEHICLE_EMISSION_FACTOR,
        }), toAppliedAssumptions({ goodsTransport, requestedElectrifiedShare, electrifiedShare }));
    });
}
export { estimate };
//# sourceMappingURL=estimate.js.map