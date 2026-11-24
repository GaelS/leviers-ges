import { toEstimateResult, } from "../../application/estimate/estimate-result.js";
import { calculateHaiesReduction, HEDGE_STORAGE_FACTOR } from "./calculate-haies-reduction.js";
function estimate({ parameters }) {
    return toEstimateResult(calculateHaiesReduction(parameters.hedgeKmCreatedPerYear, HEDGE_STORAGE_FACTOR));
}
export { estimate };
//# sourceMappingURL=estimate.js.map