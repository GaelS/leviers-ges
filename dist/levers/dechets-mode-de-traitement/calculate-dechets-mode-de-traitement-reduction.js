import { sum } from "../../domain/big-number.js";
import { KILOGRAMS_PER_TONNE } from "../../domain/mass-conversions.js";
import { quantity } from "../../domain/units.js";
import { NO_EMISSIONS_KG } from "../../domain/waste-treatment.js";
function calculateStorageToIncinerationKg({ shift, wasteType, }) {
    const { storageTonnes, storageEmissionFactor, incinerationEmissionFactor } = wasteType;
    if (storageEmissionFactor === undefined || incinerationEmissionFactor === undefined) {
        return NO_EMISSIONS_KG;
    }
    const emissionFactorGap = storageEmissionFactor.minus(incinerationEmissionFactor);
    const shiftedTonnes = storageTonnes.times(shift);
    return shiftedTonnes.times(emissionFactorGap);
}
function calculateIncinerationToMaterialRecoveryKg({ shift, wasteType, }) {
    const { incinerationTonnes, incinerationEmissionFactor } = wasteType;
    if (incinerationEmissionFactor === undefined)
        return NO_EMISSIONS_KG;
    const shiftedTonnes = incinerationTonnes.times(shift);
    return shiftedTonnes.times(incinerationEmissionFactor);
}
function calculateStorageToMaterialRecoveryKg({ shift, wasteType, }) {
    const { storageTonnes, storageEmissionFactor } = wasteType;
    if (storageEmissionFactor === undefined)
        return NO_EMISSIONS_KG;
    const shiftedTonnes = storageTonnes.times(shift);
    return shiftedTonnes.times(storageEmissionFactor);
}
function calculateWasteTypeAvoidedKg({ shifts, wasteType, }) {
    const storageToIncinerationKg = calculateStorageToIncinerationKg({
        shift: shifts.storageToIncineration,
        wasteType,
    });
    const incinerationToMaterialRecoveryKg = calculateIncinerationToMaterialRecoveryKg({
        shift: shifts.incinerationToMaterialRecovery,
        wasteType,
    });
    const storageToMaterialRecoveryKg = calculateStorageToMaterialRecoveryKg({
        shift: shifts.storageToMaterialRecovery,
        wasteType,
    });
    return sum([storageToIncinerationKg, incinerationToMaterialRecoveryKg, storageToMaterialRecoveryKg]);
}
function calculateDechetsModeDeTraitementReduction({ shifts, wasteTypes, }) {
    const avoidedKg = sum(wasteTypes.map((wasteType) => calculateWasteTypeAvoidedKg({ shifts, wasteType })));
    return quantity(avoidedKg.dividedBy(KILOGRAMS_PER_TONNE).toFixed());
}
export { calculateDechetsModeDeTraitementReduction };
//# sourceMappingURL=calculate-dechets-mode-de-traitement-reduction.js.map