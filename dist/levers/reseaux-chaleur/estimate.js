import { toEstimateResult, } from "../../application/estimate/estimate-result.js";
import { readHeatNetworks, reseauxChaleurNetworksDataset, } from "../../application/heat-networks/read-heat-networks.js";
import { calculateReseauxChaleurReduction } from "./calculate-reseaux-chaleur-reduction.js";
function estimate({ territory, parameters }, { dataSource, getCommunesOf }) {
    return getCommunesOf(territory)
        .andThen((communes) => readHeatNetworks({ dataSource, dataset: reseauxChaleurNetworksDataset, communes }))
        .map((networks) => toEstimateResult(calculateReseauxChaleurReduction({
        reductionFraction: parameters.emissionFactorReductionFraction,
        networks,
    })));
}
export { estimate };
//# sourceMappingURL=estimate.js.map