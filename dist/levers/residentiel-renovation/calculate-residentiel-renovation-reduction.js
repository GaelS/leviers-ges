import { sum } from "../../domain/big-number.js";
import { convertToKgPerKwh, ELECTRICITY_APPLIED_EMISSION_FACTOR, FUEL_OIL_EMISSION_FACTOR, LIQUEFIED_PETROLEUM_GAS_EMISSION_FACTOR, NATURAL_GAS_EMISSION_FACTOR, } from "../../domain/emission-factors.js";
import { HEATING_AND_HOT_WATER_SHARE, } from "../../domain/residential-heating-shares.js";
import { quantity } from "../../domain/units.js";
// Source : documentation fonctionnelle PlanET (juin 2026), pp. 53-54 ; PlanET V1, Residentiel_Rénovation!B13 et A34 : une rénovation réduit de 35 % la consommation des maisons et des appartements construits avant 1971, exigence de l'ANAH
const RENOVATION_REDUCTION = quantity('0.35');
// Source : src/domain/residential-consumption.ts : les cinq vecteurs de consommation résidentielle, sans le bois absent des données du territoire
const VECTORS = [
    'electricity',
    'naturalGas',
    'fuelOil',
    'liquefiedPetroleumGas',
    'heat',
];
function calculateResidentielRenovationReduction({ renovatedParcFraction, consumption, eligibleSurfaceShare, heatEmissionFactor, }) {
    const emissionFactors = {
        electricity: ELECTRICITY_APPLIED_EMISSION_FACTOR,
        naturalGas: convertToKgPerKwh(NATURAL_GAS_EMISSION_FACTOR),
        fuelOil: convertToKgPerKwh(FUEL_OIL_EMISSION_FACTOR),
        liquefiedPetroleumGas: convertToKgPerKwh(LIQUEFIED_PETROLEUM_GAS_EMISSION_FACTOR),
        heat: heatEmissionFactor,
    };
    const avoidedByVector = VECTORS.map((vector) => {
        const heatingAndHotWater = consumption[vector].times(HEATING_AND_HOT_WATER_SHARE[vector]);
        const eligibleEnergy = heatingAndHotWater.times(eligibleSurfaceShare[vector]);
        const renovatedEnergy = eligibleEnergy.times(renovatedParcFraction);
        const avoidedEnergy = renovatedEnergy.times(RENOVATION_REDUCTION);
        return avoidedEnergy.times(emissionFactors[vector]);
    });
    return quantity(sum(avoidedByVector).toFixed());
}
export { calculateResidentielRenovationReduction };
//# sourceMappingURL=calculate-residentiel-renovation-reduction.js.map