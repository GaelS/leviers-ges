import { readWasteTreatment } from "../../application/data/dechets/read-waste-treatment.js";
import { toWasteAssumptions } from "../../application/data/dechets/to-waste-assumptions.js";
import { toEstimateResult, } from "../../application/estimate/estimate-result.js";
import { calculateDechetsModeDeTraitementReduction } from "./calculate-dechets-mode-de-traitement-reduction.js";
function estimate({ territory, parameters }, { dataSource, getCommunesOf }) {
    return getCommunesOf(territory)
        .andThen((communes) => readWasteTreatment({ dataSource, communes }))
        .map((wasteTypes) => toEstimateResult(calculateDechetsModeDeTraitementReduction({
        shifts: {
            storageToIncineration: parameters.storageToIncinerationFraction,
            storageToMaterialRecovery: parameters.storageToMaterialRecoveryFraction,
            incinerationToMaterialRecovery: parameters.incinerationToMaterialRecoveryFraction,
        },
        wasteTypes,
    }), toWasteAssumptions(wasteTypes)));
}
export { estimate };
//# sourceMappingURL=estimate.js.map