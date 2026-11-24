import { Result } from 'neverthrow';
import { toEstimateResult, } from "../../application/estimate/estimate-result.js";
import { calculateOccupationDesSolsStorage } from "./calculate-occupation-des-sols-storage.js";
import { readOccupationAreas } from "./data/read-occupation-areas.js";
import { readOccupationFactors } from "./data/read-occupation-factors.js";
import { toAppliedAssumptions } from "./to-applied-assumptions.js";
function estimate({ territory, parameters }, { dataSource }) {
    return Result.combine([
        readOccupationAreas({ dataSource, territory }),
        readOccupationFactors({ dataSource, territory }),
    ]).map(([areas, factors]) => toEstimateResult(calculateOccupationDesSolsStorage({
        afforestationHectaresPerYear: parameters.afforestationHectaresPerYear,
        wetlandDevelopmentHectaresPerYear: parameters.wetlandDevelopmentHectaresPerYear,
        desealingHectaresPerYear: parameters.desealingHectaresPerYear,
        horizonYears: parameters.horizonYears,
        areas,
        factors,
    }), toAppliedAssumptions(territory.level)));
}
export { estimate };
//# sourceMappingURL=estimate.js.map