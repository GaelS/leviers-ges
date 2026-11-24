import { sum } from "../../domain/big-number.js";
import { convertToKgPerKwh, ELECTRICITY_APPLIED_EMISSION_FACTOR, FUEL_OIL_EMISSION_FACTOR, NATURAL_GAS_EMISSION_FACTOR, } from "../../domain/emission-factors.js";
import { quantity } from "../../domain/units.js";
import { HEATING_AND_HOT_WATER_SHARE } from "../../domain/residential-heating-shares.js";
import { CURRENT_EFFICIENCY, TARGET_EFFICIENCY, } from "./heating-reference.js";
// Source : documentation fonctionnelle PlanET (juin 2026), pp. 52-53 : le bois est absent des données INSEE et sa consommation de base vaut 0 ; limite reconnue
const NO_WOOD_CONSUMPTION = quantity('0');
// Source : documentation fonctionnelle PlanET (juin 2026), pp. 52-53 : facteur d'émission du bois à 0, les émissions sont comptées au prélèvement de bois
const WOOD_EMISSION_FACTOR = quantity('0');
// Source : choix de conception, non validé : un territoire sans énergie de chauffage et d'ECS n'a pas de mix actuel
const NO_CURRENT_SHARE = quantity('0');
// Source : choix de conception, non validé : un territoire sans énergie de chauffage évite 0 tCO2e plutôt qu'une division par zéro
const NO_AVOIDED_EMISSIONS = quantity('0');
function currentFinalEnergy(consumption) {
    const final = (vector, total) => quantity(total.times(HEATING_AND_HOT_WATER_SHARE[vector]).toFixed());
    return {
        electricity: final('electricity', consumption.electricity),
        naturalGas: final('naturalGas', consumption.naturalGas),
        fuelOil: final('fuelOil', consumption.fuelOil),
        wood: NO_WOOD_CONSUMPTION,
        heat: final('heat', consumption.heat),
    };
}
function calculateCurrentUsefulShares(consumption) {
    const current = currentFinalEnergy(consumption);
    const usefulOf = (vector) => quantity(current[vector].times(CURRENT_EFFICIENCY[vector]).toFixed());
    const usefulEnergy = quantity(sum([
        usefulOf('electricity'),
        usefulOf('naturalGas'),
        usefulOf('fuelOil'),
        usefulOf('wood'),
        usefulOf('heat'),
    ]).toFixed());
    const shareOf = (vector) => usefulEnergy.isZero()
        ? NO_CURRENT_SHARE
        : quantity(usefulOf(vector).dividedBy(usefulEnergy).toFixed());
    return {
        usefulEnergy,
        shares: {
            electricity: shareOf('electricity'),
            naturalGas: shareOf('naturalGas'),
            fuelOil: shareOf('fuelOil'),
            wood: shareOf('wood'),
            heat: shareOf('heat'),
        },
    };
}
function calculateResidentielChangementSystemeChauffageReduction({ targetShares, consumption, heatEmissionFactor, }) {
    const emissionFactors = {
        electricity: ELECTRICITY_APPLIED_EMISSION_FACTOR,
        naturalGas: convertToKgPerKwh(NATURAL_GAS_EMISSION_FACTOR),
        fuelOil: convertToKgPerKwh(FUEL_OIL_EMISSION_FACTOR),
        wood: WOOD_EMISSION_FACTOR,
        heat: heatEmissionFactor,
    };
    const vectors = ['electricity', 'naturalGas', 'fuelOil', 'wood', 'heat'];
    const current = currentFinalEnergy(consumption);
    const usefulEnergy = sum(vectors.map((vector) => current[vector].times(CURRENT_EFFICIENCY[vector])));
    if (usefulEnergy.isZero())
        return NO_AVOIDED_EMISSIONS;
    const avoidedByVector = vectors.map((vector) => {
        const targetUsefulEnergy = usefulEnergy.times(targetShares[vector]);
        const targetFinalEnergy = targetUsefulEnergy.dividedBy(TARGET_EFFICIENCY[vector]);
        const avoidedEnergy = current[vector].minus(targetFinalEnergy);
        return avoidedEnergy.times(emissionFactors[vector]);
    });
    return quantity(sum(avoidedByVector).toFixed());
}
export { calculateCurrentUsefulShares, calculateResidentielChangementSystemeChauffageReduction };
//# sourceMappingURL=calculate-residentiel-changement-systeme-chauffage-reduction.js.map