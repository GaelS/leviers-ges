import { toBig } from "./big-number.js";
// Source : Base Carbone, documentation générale v23.11.0 (PDF édité le 16 juin 2026), p. 173 : taux de remplissage « Courte distance : 1,4 passagers » (ENTD 2008), valeur par défaut des déplacements domicile-travail selon la documentation fonctionnelle PlanET (juin 2026), pp. 58 et 60 ; remplace le 1,165 de DonneesReference!D26 (SDES, motif « Professionnel »), la documentation l'emportant sur le tableur ; courte distance retenu pour le domicile-travail, valeur validée par l'équipe le 2026-11-19
const CAR_PASSENGERS_PER_VEHICLE = toBig('1.4');
// Source : DonneesReference!D28, « On prend la valeur du taux de remplissage des bus (10 personnes) indistinctement pour tous les bus et cars »
const BUS_PASSENGERS_PER_VEHICLE = toBig('10');
function calculateEmissionFactorPerPassengerKm({ emissionFactorPerVehicleKm, passengersPerVehicle, }) {
    return emissionFactorPerVehicleKm.dividedBy(passengersPerVehicle);
}
function calculateCarEmissionFactorPerPassengerKm(carEmissionFactor) {
    return calculateEmissionFactorPerPassengerKm({
        emissionFactorPerVehicleKm: carEmissionFactor,
        passengersPerVehicle: CAR_PASSENGERS_PER_VEHICLE,
    });
}
function calculateBusEmissionFactorPerPassengerKm(busEmissionFactor) {
    return calculateEmissionFactorPerPassengerKm({
        emissionFactorPerVehicleKm: busEmissionFactor,
        passengersPerVehicle: BUS_PASSENGERS_PER_VEHICLE,
    });
}
export { BUS_PASSENGERS_PER_VEHICLE, calculateBusEmissionFactorPerPassengerKm, calculateCarEmissionFactorPerPassengerKm, calculateEmissionFactorPerPassengerKm, CAR_PASSENGERS_PER_VEHICLE, };
//# sourceMappingURL=vehicle-occupancy.js.map