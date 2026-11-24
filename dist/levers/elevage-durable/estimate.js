import { toEstimateResult, } from "../../application/estimate/estimate-result.js";
import { calculateElevageDurableReduction } from "./calculate-elevage-durable-reduction.js";
import { readLivestockHeadcount } from "./data/read-livestock-headcount.js";
import { toAnimalChanges } from "./to-animal-changes.js";
import { toAppliedAssumptions } from "./to-applied-assumptions.js";
function estimate({ territory, parameters }, { dataSource }) {
    return readLivestockHeadcount({ dataSource, territory }).map((headcount) => toEstimateResult(calculateElevageDurableReduction(toAnimalChanges({ animals: parameters.animals, headcount })), toAppliedAssumptions(parameters.animals)));
}
export { estimate };
//# sourceMappingURL=estimate.js.map