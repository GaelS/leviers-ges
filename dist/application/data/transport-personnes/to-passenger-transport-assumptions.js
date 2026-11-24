import { toBusEmissionFactorAssumption, toBusFleetUnclassifiedAssumption, toCarFleetUnclassifiedAssumption, toNationalBusAssumption, toNationalCarAssumption, } from "./to-fleet-assumptions.js";
import { toRailShareAssumption } from "./to-rail-share-assumption.js";
import { toRailEmissionFactorAssumption } from "./to-rail-emission-factor-assumption.js";
function toPassengerTransportAssumptions({ transportInputs, railShare, railEmissionFactor, }) {
    return {
        ...toBusEmissionFactorAssumption(transportInputs),
        ...toRailEmissionFactorAssumption(railEmissionFactor),
        ...toRailShareAssumption(railShare),
        ...toCarFleetUnclassifiedAssumption(transportInputs),
        ...toBusFleetUnclassifiedAssumption(transportInputs),
        ...toNationalCarAssumption(transportInputs),
        ...toNationalBusAssumption(transportInputs),
    };
}
export { toPassengerTransportAssumptions };
//# sourceMappingURL=to-passenger-transport-assumptions.js.map