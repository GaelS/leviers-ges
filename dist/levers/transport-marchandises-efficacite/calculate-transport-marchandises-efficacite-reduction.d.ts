import { type Fraction, type KgCo2ePerTonneKilometre, type RelativeChange, type TonneKilometres, type TonnesCo2ePerYear } from '../../domain/units.ts';
declare const ECODRIVING_POTENTIAL: Fraction;
declare function calculateTransportMarchandisesEfficaciteReduction({ ecodrivingApplication, loadFactorIncrease, tonneKilometres, emissionFactor, }: {
    ecodrivingApplication: Fraction;
    loadFactorIncrease: RelativeChange;
    tonneKilometres: TonneKilometres;
    emissionFactor: KgCo2ePerTonneKilometre;
}): TonnesCo2ePerYear;
export { calculateTransportMarchandisesEfficaciteReduction, ECODRIVING_POTENTIAL };
