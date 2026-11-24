import { type Fraction, type KgCo2ePerKgNitrogen, type Tonnes, type TonnesCo2ePerYear } from '../../domain/units.ts';
declare const NITROGEN_SPREADING_EMISSION_FACTOR: KgCo2ePerKgNitrogen;
declare function calculateFertilisationAzoteeReduction({ nitrogenReductionFraction, deliveredNitrogen, }: {
    nitrogenReductionFraction: Fraction;
    deliveredNitrogen: Tonnes;
}): TonnesCo2ePerYear;
export { calculateFertilisationAzoteeReduction, NITROGEN_SPREADING_EMISSION_FACTOR };
