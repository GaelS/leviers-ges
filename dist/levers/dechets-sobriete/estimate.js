import { readWasteTreatment } from "../../application/data/dechets/read-waste-treatment.js";
import { toWasteAssumptions } from "../../application/data/dechets/to-waste-assumptions.js";
import { toEstimateResult, } from "../../application/estimate/estimate-result.js";
import { calculateDechetsSobrieteReduction } from "./calculate-dechets-sobriete-reduction.js";
function estimate({ territory, parameters }, { dataSource, getCommunesOf }) {
    return getCommunesOf(territory)
        .andThen((communes) => readWasteTreatment({ dataSource, communes }))
        .map((wasteTypes) => toEstimateResult(calculateDechetsSobrieteReduction({
        reductions: {
            storage: parameters.storageReductionFraction,
            incineration: parameters.incinerationReductionFraction,
        },
        wasteTypes,
    }), toWasteAssumptions(wasteTypes)));
}
export { estimate };
//# sourceMappingURL=estimate.js.map