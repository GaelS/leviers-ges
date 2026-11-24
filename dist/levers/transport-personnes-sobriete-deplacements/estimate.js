import { getPassengerTransportInputs } from "../../application/data/transport-personnes/get-passenger-transport-inputs.js";
import { toPassengerTransportAssumptions } from "../../application/data/transport-personnes/to-passenger-transport-assumptions.js";
import { toEstimateResult, } from "../../application/estimate/estimate-result.js";
import { calculateTransportPersonnesSobrieteDeplacementsReduction } from "./calculate-transport-personnes-sobriete-deplacements-reduction.js";
function estimate({ territory, parameters }, { dataSource, getCommunesOf, getRegionByCommune }) {
    return getCommunesOf(territory)
        .andThen((communes) => getPassengerTransportInputs({
        dataSource,
        territory,
        communes,
        requestedRailShare: parameters.railShareFraction,
        getRegionByCommune,
    }))
        .map(({ transportInputs, railShare, railEmissionFactor }) => toEstimateResult(calculateTransportPersonnesSobrieteDeplacementsReduction({
        distanceReduction: parameters.commutingDistanceReductionFraction,
        railShare: railShare.fraction,
        railEmissionFactor: railEmissionFactor.emissionFactor,
        flows: transportInputs,
    }), toPassengerTransportAssumptions({ transportInputs, railShare, railEmissionFactor })));
}
export { estimate };
//# sourceMappingURL=estimate.js.map