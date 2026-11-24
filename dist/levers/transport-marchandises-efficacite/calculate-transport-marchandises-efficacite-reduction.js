import { toBig } from "../../domain/big-number.js";
import { KILOGRAMS_PER_TONNE } from "../../domain/mass-conversions.js";
import { quantity, } from "../../domain/units.js";
// Source : élément neutre de la multiplication
const ONE = toBig('1');
// Source : documentation fonctionnelle PlanET (juin 2026), 7.3.9, p. 66 : le potentiel d'écoconduite des poids lourds est celui du transport de personnes, soit 10 % par défaut (7.3.4.3, p. 61) ; la documentation écrit aussi « 15 % » à la p. 66, contradiction tranchée par l'équipe le 2026-11-19 en faveur de 10 % ; remplace le « ~15% » de DonneesReference!D29
const ECODRIVING_POTENTIAL = quantity('0.1');
function calculateReductionFraction({ ecodrivingApplication, loadFactorIncrease, }) {
    const increasedLoadFactor = ONE.plus(loadFactorIncrease);
    const loadFactorEffect = ONE.dividedBy(increasedLoadFactor);
    const ecodrivingGain = ecodrivingApplication.times(ECODRIVING_POTENTIAL);
    const ecodrivingEffect = ONE.minus(ecodrivingGain);
    const remainingEmissions = loadFactorEffect.times(ecodrivingEffect);
    return ONE.minus(remainingEmissions);
}
function calculateTransportMarchandisesEfficaciteReduction({ ecodrivingApplication, loadFactorIncrease, tonneKilometres, emissionFactor, }) {
    const reductionFraction = calculateReductionFraction({ ecodrivingApplication, loadFactorIncrease });
    const annualEmissionsKg = tonneKilometres.times(emissionFactor);
    const avoidedEmissionsKg = annualEmissionsKg.times(reductionFraction);
    return quantity(avoidedEmissionsKg.dividedBy(KILOGRAMS_PER_TONNE).toFixed());
}
export { calculateTransportMarchandisesEfficaciteReduction, ECODRIVING_POTENTIAL };
//# sourceMappingURL=calculate-transport-marchandises-efficacite-reduction.js.map