import { toBig } from "./big-number.js";
import { calculateBusEmissionFactorPerPassengerKm } from "./vehicle-occupancy.js";
// Source : élément neutre de la multiplication
const ONE = toBig('1');
function calculatePublicTransportEmissionFactor({ busEmissionFactor, railShare, railEmissionFactor, }) {
    const roadShare = ONE.minus(railShare);
    const busEmissionFactorPerPassengerKm = calculateBusEmissionFactorPerPassengerKm(busEmissionFactor);
    const railContribution = railShare.times(railEmissionFactor);
    const roadContribution = roadShare.times(busEmissionFactorPerPassengerKm);
    return railContribution.plus(roadContribution);
}
export { calculatePublicTransportEmissionFactor };
//# sourceMappingURL=public-transport-emission-factor.js.map