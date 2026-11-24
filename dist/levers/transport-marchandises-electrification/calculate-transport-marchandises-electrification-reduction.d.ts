import { type Fraction, type KgCo2ePerTonneKilometre, type TonneKilometres, type TonnesCo2ePerYear } from '../../domain/units.ts';
declare function calculateElectrifiedShare({ requested, zeroEmissionShare, }: {
    requested: Fraction;
    zeroEmissionShare: Fraction;
}): Fraction;
declare function calculateTransportMarchandisesElectrificationReduction({ electrifiedShare, tonneKilometres, thermalEmissionFactor, electricEmissionFactor, }: {
    electrifiedShare: Fraction;
    tonneKilometres: TonneKilometres;
    thermalEmissionFactor: KgCo2ePerTonneKilometre;
    electricEmissionFactor: KgCo2ePerTonneKilometre;
}): TonnesCo2ePerYear;
export { calculateElectrifiedShare, calculateTransportMarchandisesElectrificationReduction, };
