import { sum } from "../../domain/big-number.js";
import { KILOGRAMS_PER_TONNE } from "../../domain/mass-conversions.js";
import { quantity, } from "../../domain/units.js";
import { NO_EMISSIONS_KG } from "../../domain/waste-treatment.js";
function calculateReductionKg({ reduction, tonnes, emissionFactor, }) {
    if (emissionFactor === undefined)
        return NO_EMISSIONS_KG;
    const reducedTonnes = tonnes.times(reduction);
    return reducedTonnes.times(emissionFactor);
}
function calculateWasteTypeAvoidedKg({ reductions, wasteType, }) {
    const storageReductionKg = calculateReductionKg({
        reduction: reductions.storage,
        tonnes: wasteType.storageTonnes,
        emissionFactor: wasteType.storageEmissionFactor,
    });
    const incinerationReductionKg = calculateReductionKg({
        reduction: reductions.incineration,
        tonnes: wasteType.incinerationTonnes,
        emissionFactor: wasteType.incinerationEmissionFactor,
    });
    return sum([storageReductionKg, incinerationReductionKg]);
}
function calculateDechetsSobrieteReduction({ reductions, wasteTypes, }) {
    const avoidedKg = sum(wasteTypes.map((wasteType) => calculateWasteTypeAvoidedKg({ reductions, wasteType })));
    return quantity(avoidedKg.dividedBy(KILOGRAMS_PER_TONNE).toFixed());
}
export { calculateDechetsSobrieteReduction };
//# sourceMappingURL=calculate-dechets-sobriete-reduction.js.map