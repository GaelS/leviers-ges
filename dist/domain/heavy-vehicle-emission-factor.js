import { toBig } from "./big-number.js";
import { quantity } from "./units.js";
// Source : hypothèse nommée heavyVehicleLoadFactor (docs/methodology/assumptions.md) : guide SGPE « Panorama des leviers » du 16/02/2024, p. 37, « Taux de remplissage moyen des véhicules lourds : de 8,1t à 8,7t » (8,1 t en 2019) ; DonneesReference!D43 demande « la valeur SNBC3 » sans la donner
const HEAVY_VEHICLE_LOADING_RATE = quantity('8.1');
// Source : Base Empreinte de l'ADEME, élément 28030 « Rigide, 3,5 à 7,5 tonnes, Electrique », poste Amont (carburant) seul, validité avril 2021, incertitude 70 % : 0,0467 kgCO2e par tonne.kilomètre ; total 0,058 dont fabrication 0,0113 exclue
const ELECTRIC_HEAVY_VEHICLE_EMISSION_FACTOR = quantity('0.0467');
// Source : élément neutre de la multiplication
const ONE = toBig('1');
function calculateThermalEmissionFactor(dieselEmissionFactor) {
    return quantity(dieselEmissionFactor.dividedBy(HEAVY_VEHICLE_LOADING_RATE).toFixed());
}
function calculateZeroEmissionShare({ heavyVehicleFleet, zeroEmissionFleet, }) {
    return quantity(zeroEmissionFleet.dividedBy(heavyVehicleFleet).toFixed());
}
function calculateThermalShare(zeroEmissionShare) {
    return quantity(ONE.minus(zeroEmissionShare).toFixed());
}
function calculateHeavyVehicleEmissionFactors({ dieselEmissionFactor, heavyVehicleFleet, zeroEmissionFleet, }) {
    const thermal = calculateThermalEmissionFactor(dieselEmissionFactor);
    const zeroEmissionShare = calculateZeroEmissionShare({ heavyVehicleFleet, zeroEmissionFleet });
    const thermalShare = calculateThermalShare(zeroEmissionShare);
    const thermalContribution = thermalShare.times(thermal);
    const electricContribution = zeroEmissionShare.times(ELECTRIC_HEAVY_VEHICLE_EMISSION_FACTOR);
    return {
        thermal,
        mixed: quantity(thermalContribution.plus(electricContribution).toFixed()),
        zeroEmissionShare,
    };
}
export { calculateHeavyVehicleEmissionFactors, calculateThermalShare, ELECTRIC_HEAVY_VEHICLE_EMISSION_FACTOR, HEAVY_VEHICLE_LOADING_RATE, };
//# sourceMappingURL=heavy-vehicle-emission-factor.js.map