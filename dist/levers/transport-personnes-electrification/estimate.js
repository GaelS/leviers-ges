import { toEstimateResult, } from "../../application/estimate/estimate-result.js";
import { calculateTransportPersonnesElectrificationReduction } from "./calculate-transport-personnes-electrification-reduction.js";
import { getElectrificationInputs } from "./data/get-electrification-inputs.js";
import { toAppliedAssumptions } from "./to-applied-assumptions.js";
function estimate({ territory, parameters }, { dataSource, getCommunesOf, getRegionByCommune }) {
    return getCommunesOf(territory)
        .andThen((communes) => getElectrificationInputs({
        dataSource,
        territory,
        communes,
        requestedRailShare: parameters.railShareFraction,
        getRegionByCommune,
    }))
        .map(({ transportInputs, thermalFleet, railShare }) => {
        const fractions = {
            carElectrification: parameters.carElectrificationFraction,
            busElectrification: parameters.busElectrificationFraction,
        };
        return toEstimateResult(calculateTransportPersonnesElectrificationReduction({
            fractions,
            railShare: railShare.fraction,
            transportFlows: transportInputs,
            thermalFleet,
        }), toAppliedAssumptions({ fractions, thermalFleet, railShare }));
    });
}
export { estimate };
//# sourceMappingURL=estimate.js.map