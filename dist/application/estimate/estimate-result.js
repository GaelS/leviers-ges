import { roundOutput } from "../../domain/big-number.js";
import { quantity } from "../../domain/units.js";
function toEstimateResult(reduction, appliedAssumptions = {}) {
    return {
        reduction: quantity(roundOutput(reduction).toFixed()),
        appliedAssumptions,
    };
}
export { toEstimateResult };
//# sourceMappingURL=estimate-result.js.map