import { KILOGRAMS_PER_TONNE } from "../../domain/mass-conversions.js";
import { quantity, } from "../../domain/units.js";
function calculateTransportMarchandisesSobrieteLogistiqueReduction({ roadFreightReduction, tonneKilometres, emissionFactor, }) {
    const avoidedTonneKilometres = tonneKilometres.times(roadFreightReduction);
    const avoidedEmissionsKg = avoidedTonneKilometres.times(emissionFactor);
    return quantity(avoidedEmissionsKg.dividedBy(KILOGRAMS_PER_TONNE).toFixed());
}
export { calculateTransportMarchandisesSobrieteLogistiqueReduction };
//# sourceMappingURL=calculate-transport-marchandises-sobriete-logistique-reduction.js.map