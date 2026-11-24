import { sum } from "../../domain/big-number.js";
import { KILOGRAMS_PER_TONNE } from "../../domain/mass-conversions.js";
import { WEEKS_PER_YEAR } from "../../domain/transport-conversions.js";
import { quantity, } from "../../domain/units.js";
import { calculatePublicTransportEmissionFactor } from "../../domain/public-transport-emission-factor.js";
import { calculateCarEmissionFactorPerPassengerKm } from "../../domain/vehicle-occupancy.js";
function calculateTransportPersonnesReportModalReduction({ fractions, railShare, railEmissionFactor, flows, }) {
    const carEmissionFactorPerPassengerKm = calculateCarEmissionFactorPerPassengerKm(flows.carEmissionFactor);
    const publicTransportEmissionFactor = calculatePublicTransportEmissionFactor({
        busEmissionFactor: flows.busEmissionFactor,
        railShare,
        railEmissionFactor,
    });
    const gainToPublicTransport = carEmissionFactorPerPassengerKm.minus(publicTransportEmissionFactor);
    const publicTransportAvoidedPerPassengerKm = fractions.carToPublicTransport.times(gainToPublicTransport);
    const activeModesAvoidedPerPassengerKm = fractions.carToActiveModes.times(carEmissionFactorPerPassengerKm);
    const avoidedPerPassengerKm = sum([
        publicTransportAvoidedPerPassengerKm,
        activeModesAvoidedPerPassengerKm,
    ]);
    const annualPassengerKm = flows.carWeeklyPassengerKm.times(WEEKS_PER_YEAR);
    const carShiftAvoidedEmissionsKg = annualPassengerKm.times(avoidedPerPassengerKm);
    const annualPublicTransportPassengerKm = flows.publicTransportWeeklyPassengerKm.times(WEEKS_PER_YEAR);
    const shiftedPublicTransportPassengerKm = annualPublicTransportPassengerKm.times(fractions.publicTransportToActiveModes);
    const publicTransportShiftAvoidedEmissionsKg = shiftedPublicTransportPassengerKm.times(publicTransportEmissionFactor);
    const avoidedEmissionsKg = sum([carShiftAvoidedEmissionsKg, publicTransportShiftAvoidedEmissionsKg]);
    return quantity(avoidedEmissionsKg.dividedBy(KILOGRAMS_PER_TONNE).toFixed());
}
export { calculateTransportPersonnesReportModalReduction };
//# sourceMappingURL=calculate-transport-personnes-report-modal-reduction.js.map