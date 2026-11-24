import { sum, toBig } from "../../domain/big-number.js";
import { ELECTRIC_BUS_EMISSION_FACTOR, ELECTRIC_CAR_EMISSION_FACTOR, } from "../../domain/emission-factors.js";
import { quantity, } from "../../domain/units.js";
import { KILOGRAMS_PER_TONNE } from "../../domain/mass-conversions.js";
import { WEEKS_PER_YEAR } from "../../domain/transport-conversions.js";
import { BUS_PASSENGERS_PER_VEHICLE, CAR_PASSENGERS_PER_VEHICLE, } from "../../domain/vehicle-occupancy.js";
// Source : élément neutre de la multiplication
const ONE = toBig('1');
function calculateElectrifiedShare({ requested, thermalShare, }) {
    return requested.isGreaterThan(thermalShare) ? thermalShare : requested;
}
function calculateElectrifiedCarShare({ fractions, thermalFleet, }) {
    return calculateElectrifiedShare({
        requested: fractions.carElectrification,
        thermalShare: thermalFleet.carThermalFleetShare,
    });
}
function calculateElectrifiedBusShare({ fractions, thermalFleet, }) {
    return calculateElectrifiedShare({
        requested: fractions.busElectrification,
        thermalShare: thermalFleet.busThermalFleetShare,
    });
}
function calculateAvoidedEmissions({ electrifiedShare, weeklyPassengerKm, thermalEmissionFactor, electricEmissionFactor, passengersPerVehicle, }) {
    const emissionFactorGain = thermalEmissionFactor.minus(electricEmissionFactor);
    const emissionFactorGainPerPassengerKm = emissionFactorGain.dividedBy(passengersPerVehicle);
    const annualPassengerKm = weeklyPassengerKm.times(WEEKS_PER_YEAR);
    const electrifiedAnnualPassengerKm = annualPassengerKm.times(electrifiedShare);
    const avoidedEmissionsKg = electrifiedAnnualPassengerKm.times(emissionFactorGainPerPassengerKm);
    return avoidedEmissionsKg.dividedBy(KILOGRAMS_PER_TONNE);
}
function calculateTransportPersonnesElectrificationReduction({ fractions, railShare, transportFlows, thermalFleet, }) {
    const roadShare = ONE.minus(railShare);
    const roadPublicTransportWeeklyPassengerKm = transportFlows.publicTransportWeeklyPassengerKm.times(roadShare);
    const carAvoidedEmissions = calculateAvoidedEmissions({
        electrifiedShare: calculateElectrifiedCarShare({ fractions, thermalFleet }),
        weeklyPassengerKm: transportFlows.carWeeklyPassengerKm,
        thermalEmissionFactor: thermalFleet.carThermalEmissionFactor,
        electricEmissionFactor: ELECTRIC_CAR_EMISSION_FACTOR,
        passengersPerVehicle: CAR_PASSENGERS_PER_VEHICLE,
    });
    const busAvoidedEmissions = calculateAvoidedEmissions({
        electrifiedShare: calculateElectrifiedBusShare({ fractions, thermalFleet }),
        weeklyPassengerKm: roadPublicTransportWeeklyPassengerKm,
        thermalEmissionFactor: thermalFleet.busThermalEmissionFactor,
        electricEmissionFactor: ELECTRIC_BUS_EMISSION_FACTOR,
        passengersPerVehicle: BUS_PASSENGERS_PER_VEHICLE,
    });
    return quantity(sum([carAvoidedEmissions, busAvoidedEmissions]).toFixed());
}
export { calculateElectrifiedBusShare, calculateElectrifiedCarShare, calculateTransportPersonnesElectrificationReduction, };
//# sourceMappingURL=calculate-transport-personnes-electrification-reduction.js.map