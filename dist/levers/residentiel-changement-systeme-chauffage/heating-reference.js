import { quantity } from "../../domain/units.js";
// Source : ADEME, « Rénovation performante par étapes » (2021), p. 156, rendements globaux des installations existantes : ancienne chaudière gaz 75 %, ancienne chaudière fioul 75 %,
// poêle à bois ancien 70 %, radiateur électrique existant 95 % ; chaleur livrée : 1 (Residentiel_ChgtSyst, « l'énergie livrée correspond à l'énergie utile »)
const CURRENT_EFFICIENCY = {
    electricity: quantity('0.95'),
    naturalGas: quantity('0.75'),
    fuelOil: quantity('0.75'),
    wood: quantity('0.70'),
    heat: quantity('1'),
};
// Source : ADEME, « Rénovation performante par étapes » (2021), p. 156, rendements des installations rénovées : chaudière gaz 90 %, chaudière fioul 90 %, radiateur électrique rénové 100 %,
// poêle à bois rénové 75 % (la plus basse des deux valeurs bois, 75 % et 85 %, choix de conception, non validé) ; chaleur livrée : 1
const TARGET_EFFICIENCY = {
    electricity: quantity('1'),
    naturalGas: quantity('0.9'),
    fuelOil: quantity('0.9'),
    wood: quantity('0.75'),
    heat: quantity('1'),
};
export { CURRENT_EFFICIENCY, TARGET_EFFICIENCY };
//# sourceMappingURL=heating-reference.js.map