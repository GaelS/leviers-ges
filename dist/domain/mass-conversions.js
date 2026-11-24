import { toBig } from "./big-number.js";
// Source : BIPM, Le Système international d'unités (Brochure SI), 9e édition : kilo = 10^3, donc 1 t = 1 000 kg
const KILOGRAMS_PER_TONNE = toBig('1000');
// Source : BIPM, Le Système international d'unités (Brochure SI), 9e édition : kilo = 10^3, donc 1 kg = 1 000 g
const GRAMS_PER_KILOGRAM = toBig('1000');
// Source : BIPM, Le Système international d'unités (Brochure SI), 9e édition : giga = 10^9, donc un milliard de tonnes.kilomètres = 10^9 tonnes.kilomètres
const TONNE_KILOMETRES_PER_BILLION = toBig('1000000000');
export { GRAMS_PER_KILOGRAM, KILOGRAMS_PER_TONNE, TONNE_KILOMETRES_PER_BILLION };
//# sourceMappingURL=mass-conversions.js.map