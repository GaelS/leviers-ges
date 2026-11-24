import { getPassengerTransportInputs } from "../../application/data/transport-personnes/get-passenger-transport-inputs.js";
import { toPassengerTransportAssumptions } from "../../application/data/transport-personnes/to-passenger-transport-assumptions.js";
import { toEstimateResult, } from "../../application/estimate/estimate-result.js";
import { calculateTransportPersonnesReportModalReduction } from "./calculate-transport-personnes-report-modal-reduction.js";
function estimate({ territory, parameters }, { dataSource, getCommunesOf, getRegionByCommune }) {
    return getCommunesOf(territory)
        .andThen((communes) => getPassengerTransportInputs({
        dataSource,
        territory,
        communes,
        requestedRailShare: parameters.railShareFraction,
        getRegionByCommune,
    }))
        .map(({ transportInputs, railShare, railEmissionFactor }) => toEstimateResult(calculateTransportPersonnesReportModalReduction({
        fractions: {
            carToPublicTransport: parameters.carToPublicTransportFraction,
            carToActiveModes: parameters.carToActiveModesFraction,
            publicTransportToActiveModes: parameters.publicTransportToActiveModesFraction,
        },
        railShare: railShare.fraction,
        railEmissionFactor: railEmissionFactor.emissionFactor,
        flows: transportInputs,
    }), toPassengerTransportAssumptions({ transportInputs, railShare, railEmissionFactor })));
}
export { estimate };
//# sourceMappingURL=estimate.js.map