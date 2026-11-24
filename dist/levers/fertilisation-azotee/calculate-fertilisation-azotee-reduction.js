import { KILOGRAMS_PER_TONNE } from "../../domain/mass-conversions.js";
import { quantity, } from "../../domain/units.js";
// Source : Base Empreinte de l'ADEME, élément 24270, engrais minéraux azotés épandus, France continentale, poste total, version 23.11, validité décembre 2018, incertitude 400 %
const NITROGEN_SPREADING_EMISSION_FACTOR = quantity('5.733');
function calculateFertilisationAzoteeReduction({ nitrogenReductionFraction, deliveredNitrogen, }) {
    const deliveredNitrogenKg = deliveredNitrogen.times(KILOGRAMS_PER_TONNE);
    const avoidedNitrogenKg = deliveredNitrogenKg.times(nitrogenReductionFraction);
    const avoidedEmissionsKg = avoidedNitrogenKg.times(NITROGEN_SPREADING_EMISSION_FACTOR);
    return quantity(avoidedEmissionsKg.dividedBy(KILOGRAMS_PER_TONNE).toFixed());
}
export { calculateFertilisationAzoteeReduction, NITROGEN_SPREADING_EMISSION_FACTOR };
//# sourceMappingURL=calculate-fertilisation-azotee-reduction.js.map