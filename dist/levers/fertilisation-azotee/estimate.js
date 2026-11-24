import { toEstimateResult, } from "../../application/estimate/estimate-result.js";
import { calculateEpciDeliveredNitrogen } from "./calculate-epci-delivered-nitrogen.js";
import { calculateFertilisationAzoteeReduction } from "./calculate-fertilisation-azotee-reduction.js";
import { readEpciNitrogenParts } from "./data/read-epci-nitrogen-parts.js";
import { readNitrogenDelivered } from "./data/read-nitrogen-delivered.js";
import { toAppliedAssumptions } from "./to-applied-assumptions.js";
function readDelivered({ territory, context, }) {
    const { dataSource, getCommunesOf, getDepartementByCommune } = context;
    if (territory.level === 'epci') {
        return readEpciNitrogenParts({
            dataSource,
            territory: { ...territory, level: territory.level },
            getCommunesOf,
            getDepartementByCommune,
        }).map((parts) => ({ tonnes: calculateEpciDeliveredNitrogen(parts) }));
    }
    return readNitrogenDelivered({ dataSource, territory: { ...territory, level: territory.level } });
}
function estimate({ territory, parameters }, context) {
    return readDelivered({ territory, context }).map((delivered) => toEstimateResult(calculateFertilisationAzoteeReduction({
        nitrogenReductionFraction: parameters.nitrogenReductionFraction,
        deliveredNitrogen: delivered.tonnes,
    }), toAppliedAssumptions()));
}
export { estimate };
//# sourceMappingURL=estimate.js.map