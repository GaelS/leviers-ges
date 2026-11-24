import { calculateThermalShare } from "../../domain/heavy-vehicle-emission-factor.js";
import { KILOGRAMS_PER_TONNE } from "../../domain/mass-conversions.js";
import { quantity, } from "../../domain/units.js";
function calculateElectrifiedShare({ requested, zeroEmissionShare, }) {
    const thermalShare = calculateThermalShare(zeroEmissionShare);
    return requested.isGreaterThan(thermalShare) ? thermalShare : requested;
}
function calculateTransportMarchandisesElectrificationReduction({ electrifiedShare, tonneKilometres, thermalEmissionFactor, electricEmissionFactor, }) {
    const electrifiedTonneKilometres = tonneKilometres.times(electrifiedShare);
    const emissionFactorGap = thermalEmissionFactor.minus(electricEmissionFactor);
    const avoidedEmissionsKg = electrifiedTonneKilometres.times(emissionFactorGap);
    return quantity(avoidedEmissionsKg.dividedBy(KILOGRAMS_PER_TONNE).toFixed());
}
export { calculateElectrifiedShare, calculateTransportMarchandisesElectrificationReduction, };
//# sourceMappingURL=calculate-transport-marchandises-electrification-reduction.js.map