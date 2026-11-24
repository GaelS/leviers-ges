import { sum, toBig } from "../../domain/big-number.js";
import { KILOGRAMS_PER_TONNE } from "../../domain/mass-conversions.js";
import { WEEKS_PER_YEAR } from "../../domain/transport-conversions.js";
import { BUS_PASSENGERS_PER_VEHICLE, calculateEmissionFactorPerPassengerKm, CAR_PASSENGERS_PER_VEHICLE, } from "../../domain/vehicle-occupancy.js";
import { quantity, } from "../../domain/units.js";
// Source : élément neutre de la multiplication
const ONE = toBig('1');
// Source : documentation fonctionnelle PlanET (juin 2026), 7.3.4.3, p. 61 : « le pourcentage de potentiel de baisse par écoconduite est identique pour les TC routiers et les VP. PlanET propose une valeur par défaut de 10 % » (enquête IPSOS pour la Fondation Vinci Autoroutes) ; remplace le « ~15% » de DonneesReference!D29, la documentation l'emportant sur le tableur ; valeur confirmée par l'équipe le 2026-11-19
const ECODRIVING_POTENTIAL = quantity('0.1');
function calculateReductionFraction({ ecodrivingApplication, passengerIncrease, }) {
    const increasedOccupancy = ONE.plus(passengerIncrease);
    const occupancyEffect = ONE.dividedBy(increasedOccupancy);
    const ecodrivingGain = ecodrivingApplication.times(ECODRIVING_POTENTIAL);
    const ecodrivingEffect = ONE.minus(ecodrivingGain);
    const remainingEmissions = occupancyEffect.times(ecodrivingEffect);
    return ONE.minus(remainingEmissions);
}
function calculateAvoidedEmissions({ weeklyPassengerKm, emissionFactorPerVehicleKm, passengersPerVehicle, reductionFraction, }) {
    const emissionFactorPerPassengerKm = calculateEmissionFactorPerPassengerKm({
        emissionFactorPerVehicleKm,
        passengersPerVehicle,
    });
    const annualPassengerKm = weeklyPassengerKm.times(WEEKS_PER_YEAR);
    const annualEmissionsKg = annualPassengerKm.times(emissionFactorPerPassengerKm);
    const avoidedEmissionsKg = annualEmissionsKg.times(reductionFraction);
    return avoidedEmissionsKg.dividedBy(KILOGRAMS_PER_TONNE);
}
function calculateTransportPersonnesEfficaciteReduction({ fractions, railShare, transportInputs, }) {
    const roadShare = ONE.minus(railShare);
    const roadPublicTransportWeeklyPassengerKm = transportInputs.publicTransportWeeklyPassengerKm.times(roadShare);
    const carAvoidedEmissions = calculateAvoidedEmissions({
        weeklyPassengerKm: transportInputs.carWeeklyPassengerKm,
        emissionFactorPerVehicleKm: transportInputs.carEmissionFactor,
        passengersPerVehicle: CAR_PASSENGERS_PER_VEHICLE,
        reductionFraction: calculateReductionFraction({
            ecodrivingApplication: fractions.carEcodrivingApplication,
            passengerIncrease: fractions.carPassengerIncrease,
        }),
    });
    const busAvoidedEmissions = calculateAvoidedEmissions({
        weeklyPassengerKm: roadPublicTransportWeeklyPassengerKm,
        emissionFactorPerVehicleKm: transportInputs.busEmissionFactor,
        passengersPerVehicle: BUS_PASSENGERS_PER_VEHICLE,
        reductionFraction: calculateReductionFraction({
            ecodrivingApplication: fractions.busEcodrivingApplication,
            passengerIncrease: fractions.busPassengerIncrease,
        }),
    });
    return quantity(sum([carAvoidedEmissions, busAvoidedEmissions]).toFixed());
}
export { calculateTransportPersonnesEfficaciteReduction, ECODRIVING_POTENTIAL, };
//# sourceMappingURL=calculate-transport-personnes-efficacite-reduction.js.map