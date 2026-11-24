import { toEstimateResult, } from "../../application/estimate/estimate-result.js";
import { getResidentialInputs } from "../../application/residential-consumption/get-residential-inputs.js";
import { calculateResidentielRenovationReduction } from "./calculate-residentiel-renovation-reduction.js";
import { readEligibleSurfaceShares } from "./data/read-eligible-surface-shares.js";
import { toAppliedAssumptions } from "./to-applied-assumptions.js";
function estimate({ territory, parameters }, { dataSource, getCommunesOf, getDepartementByCommune }) {
    return getCommunesOf(territory).andThen((communes) => getResidentialInputs({ dataSource, territory, communes }).andThen(({ consumption, heatEmissionFactor }) => readEligibleSurfaceShares({ dataSource, territory, communes, getDepartementByCommune }).map((eligibleSurfaceShare) => toEstimateResult(calculateResidentielRenovationReduction({
        renovatedParcFraction: parameters.renovatedParcFraction,
        consumption,
        eligibleSurfaceShare,
        heatEmissionFactor,
    }), toAppliedAssumptions()))));
}
export { estimate };
//# sourceMappingURL=estimate.js.map