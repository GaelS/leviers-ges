import { quantity } from "../../domain/units.js";
import { ANIMAL_TYPES } from "./data/animal-types.js";
// Source : ParametreDeterminants!I9 : valeur par défaut de la baisse du facteur d'émission de fermentation entérique, « 0 »
const DEFAULT_ENTERIC_EMISSION_REDUCTION = quantity('0');
function toAnimalChanges({ animals, headcount, }) {
    return ANIMAL_TYPES.flatMap((animalType) => {
        const requested = animals[animalType];
        if (requested === undefined)
            return [];
        return [
            {
                animalType,
                headcount: headcount[animalType],
                headcountReduction: requested.headcountReductionFraction,
                entericEmissionReduction: requested.entericEmissionReductionFraction ?? DEFAULT_ENTERIC_EMISSION_REDUCTION,
                targetShares: requested.targetManureShares,
            },
        ];
    });
}
export { DEFAULT_ENTERIC_EMISSION_REDUCTION, toAnimalChanges };
//# sourceMappingURL=to-animal-changes.js.map