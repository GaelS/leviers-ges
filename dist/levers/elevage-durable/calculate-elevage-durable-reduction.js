import { sum } from "../../domain/big-number.js";
import { KILOGRAMS_PER_TONNE } from "../../domain/mass-conversions.js";
import { quantity } from "../../domain/units.js";
import { ANIMAL_PARAMETERS, } from "./animal-parameters.js";
import { DAYS_PER_YEAR, DIGESTION_METHANE_CONVERSION_FACTOR, DIGESTION_NITROUS_OXIDE_FACTOR, INITIAL_DIGESTION_SHARE, LIQUID_MANURE_NITROUS_OXIDE_FACTOR, METHANE_DENSITY_KG_PER_CUBIC_METRE, METHANE_GLOBAL_WARMING_POTENTIAL, NITROGEN_MOLAR_MASS_IN_NITROUS_OXIDE, NITROUS_OXIDE_GLOBAL_WARMING_POTENTIAL, NITROUS_OXIDE_MOLAR_MASS, NO_CONVERSION_CONTRIBUTION, ONE, PASTURE_NITROUS_OXIDE_FACTOR, SOLID_MANURE_NITROUS_OXIDE_FACTOR, } from "./emission-constants.js";
function weightedFactor({ factor, share, }) {
    if (factor === undefined)
        return NO_CONVERSION_CONTRIBUTION;
    return factor.times(share);
}
function sumWeightedFactors({ factors, shares, }) {
    return sum([
        weightedFactor({ factor: factors.liquid, share: shares.liquid }),
        weightedFactor({ factor: factors.solid, share: shares.solid }),
        weightedFactor({ factor: factors.pasture, share: shares.pasture }),
        weightedFactor({ factor: factors.anaerobicDigestion, share: shares.anaerobicDigestion }),
    ]);
}
function toCurrentShares({ currentManureShares }) {
    return { ...currentManureShares, anaerobicDigestion: INITIAL_DIGESTION_SHARE };
}
function toMethaneFactors(parameters) {
    return {
        ...parameters.methaneConversionFactors,
        anaerobicDigestion: parameters.canBeDigested ? DIGESTION_METHANE_CONVERSION_FACTOR : undefined,
    };
}
function toNitrousOxideFactors(parameters) {
    return {
        liquid: LIQUID_MANURE_NITROUS_OXIDE_FACTOR,
        solid: SOLID_MANURE_NITROUS_OXIDE_FACTOR,
        pasture: PASTURE_NITROUS_OXIDE_FACTOR,
        anaerobicDigestion: parameters.canBeDigested ? DIGESTION_NITROUS_OXIDE_FACTOR : undefined,
    };
}
function calculateMethaneReductionPerHeadKg({ parameters, change, }) {
    const factors = toMethaneFactors(parameters);
    const volatileSolidsPerYear = parameters.volatileSolids.times(DAYS_PER_YEAR);
    const methaneCapacityPerYear = volatileSolidsPerYear.times(parameters.maximumMethaneCapacity);
    const manureMethaneFactor = methaneCapacityPerYear.times(METHANE_DENSITY_KG_PER_CUBIC_METRE);
    const currentConversion = sumWeightedFactors({ factors, shares: toCurrentShares(parameters) });
    const targetConversion = sumWeightedFactors({ factors, shares: change.targetShares });
    const currentManureMethane = manureMethaneFactor.times(currentConversion);
    const targetManureMethane = manureMethaneFactor.times(targetConversion);
    const currentMethane = parameters.entericEmissionFactor.plus(currentManureMethane);
    const remainingEntericShare = ONE.minus(change.entericEmissionReduction);
    const remainingEnteric = remainingEntericShare.times(parameters.entericEmissionFactor);
    const remainingHeadcountShare = ONE.minus(change.headcountReduction);
    const remainingEntericAndManure = remainingEnteric.plus(targetManureMethane);
    const targetMethane = remainingHeadcountShare.times(remainingEntericAndManure);
    const methaneDifference = currentMethane.minus(targetMethane);
    return methaneDifference.times(METHANE_GLOBAL_WARMING_POTENTIAL);
}
function calculateNitrousOxideReductionPerHeadKg({ parameters, change, }) {
    const factors = toNitrousOxideFactors(parameters);
    const molarMassRatio = NITROUS_OXIDE_MOLAR_MASS.dividedBy(NITROGEN_MOLAR_MASS_IN_NITROUS_OXIDE);
    const excretionAsNitrousOxide = parameters.nitrogenExcretion.times(molarMassRatio);
    const currentConversion = sumWeightedFactors({ factors, shares: toCurrentShares(parameters) });
    const targetConversion = sumWeightedFactors({ factors, shares: change.targetShares });
    const currentNitrousOxide = excretionAsNitrousOxide.times(currentConversion);
    const targetNitrousOxideAtFullHeadcount = excretionAsNitrousOxide.times(targetConversion);
    const remainingHeadcountShare = ONE.minus(change.headcountReduction);
    const targetNitrousOxide = remainingHeadcountShare.times(targetNitrousOxideAtFullHeadcount);
    const nitrousOxideDifference = currentNitrousOxide.minus(targetNitrousOxide);
    return nitrousOxideDifference.times(NITROUS_OXIDE_GLOBAL_WARMING_POTENTIAL);
}
function calculateAnimalReductionKg(change) {
    const parameters = ANIMAL_PARAMETERS[change.animalType];
    const methaneReductionPerHead = calculateMethaneReductionPerHeadKg({ parameters, change });
    const nitrousOxideReductionPerHead = calculateNitrousOxideReductionPerHeadKg({ parameters, change });
    const reductionPerHead = methaneReductionPerHead.plus(nitrousOxideReductionPerHead);
    return change.headcount.times(reductionPerHead);
}
function calculateElevageDurableReduction(changes) {
    const reductionKg = sum(changes.map(calculateAnimalReductionKg));
    return quantity(reductionKg.dividedBy(KILOGRAMS_PER_TONNE).toFixed());
}
export { calculateElevageDurableReduction };
//# sourceMappingURL=calculate-elevage-durable-reduction.js.map