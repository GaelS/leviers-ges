import { sum } from "../../domain/big-number.js";
import { calculatePublicTransportEmissionFactor } from "../../domain/public-transport-emission-factor.js";
import { KILOGRAMS_PER_TONNE } from "../../domain/mass-conversions.js";
import { WEEKS_PER_YEAR } from "../../domain/transport-conversions.js";
import { quantity, } from "../../domain/units.js";
import { calculateCarEmissionFactorPerPassengerKm } from "../../domain/vehicle-occupancy.js";
function calculateTransportPersonnesSobrieteDeplacementsReduction({ distanceReduction, railShare, railEmissionFactor, flows, }) {
    const carEmissionFactorPerPassengerKm = calculateCarEmissionFactorPerPassengerKm(flows.carEmissionFactor);
    const publicTransportEmissionFactor = calculatePublicTransportEmissionFactor({
        busEmissionFactor: flows.busEmissionFactor,
        railShare,
        railEmissionFactor,
    });
    const carWeeklyEmissions = flows.carWeeklyPassengerKm.times(carEmissionFactorPerPassengerKm);
    const publicTransportWeeklyEmissions = flows.publicTransportWeeklyPassengerKm.times(publicTransportEmissionFactor);
    const weeklyEmissionsKg = sum([carWeeklyEmissions, publicTransportWeeklyEmissions]);
    const annualEmissionsKg = weeklyEmissionsKg.times(WEEKS_PER_YEAR);
    const avoidedEmissionsKg = annualEmissionsKg.times(distanceReduction);
    return quantity(avoidedEmissionsKg.dividedBy(KILOGRAMS_PER_TONNE).toFixed());
}
export { calculateTransportPersonnesSobrieteDeplacementsReduction };
//# sourceMappingURL=calculate-transport-personnes-sobriete-deplacements-reduction.js.map