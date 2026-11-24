import { toEstimateResult, } from "../../application/estimate/estimate-result.js";
import { calculateTransportPersonnesEfficaciteReduction } from "./calculate-transport-personnes-efficacite-reduction.js";
import { getEfficiencyInputs } from "./data/get-efficiency-inputs.js";
import { toAppliedAssumptions } from "./to-applied-assumptions.js";
function estimate({ territory, parameters }, { dataSource, getCommunesOf, getRegionByCommune }) {
    return getCommunesOf(territory)
        .andThen((communes) => getEfficiencyInputs({
        dataSource,
        territory,
        communes,
        requestedRailShare: parameters.railShareFraction,
        getRegionByCommune,
    }))
        .map(({ transportInputs, railShare }) => toEstimateResult(calculateTransportPersonnesEfficaciteReduction({
        fractions: {
            carEcodrivingApplication: parameters.carEcodrivingApplicationFraction,
            busEcodrivingApplication: parameters.busEcodrivingApplicationFraction,
            carPassengerIncrease: parameters.carPassengerIncrease,
            busPassengerIncrease: parameters.busPassengerIncrease,
        },
        railShare: railShare.fraction,
        transportInputs,
    }), toAppliedAssumptions({ transportInputs, railShare })));
}
export { estimate };
//# sourceMappingURL=estimate.js.map