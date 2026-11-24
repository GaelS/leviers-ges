import { toEstimateResult, } from "../../application/estimate/estimate-result.js";
import { calculateResidentielSobrieteReduction } from "./calculate-residentiel-sobriete-reduction.js";
import { getResidentialInputs } from "../../application/residential-consumption/get-residential-inputs.js";
function estimate({ territory, parameters }, { dataSource, getCommunesOf }) {
    return getCommunesOf(territory)
        .andThen((communes) => getResidentialInputs({ dataSource, territory, communes }))
        .map(({ consumption, heatEmissionFactor }) => toEstimateResult(calculateResidentielSobrieteReduction({
        sobrietyFractions: {
            households: parameters.householdsApplyingSobrietyFraction,
            consumptionReduction: parameters.consumptionReductionFraction,
        },
        consumption,
        heatEmissionFactor,
    })));
}
export { estimate };
//# sourceMappingURL=estimate.js.map