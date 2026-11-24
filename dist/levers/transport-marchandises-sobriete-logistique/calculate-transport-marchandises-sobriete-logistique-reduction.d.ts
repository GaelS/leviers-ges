import { type Fraction, type KgCo2ePerTonneKilometre, type TonneKilometres, type TonnesCo2ePerYear } from '../../domain/units.ts';
declare function calculateTransportMarchandisesSobrieteLogistiqueReduction({ roadFreightReduction, tonneKilometres, emissionFactor, }: {
    roadFreightReduction: Fraction;
    tonneKilometres: TonneKilometres;
    emissionFactor: KgCo2ePerTonneKilometre;
}): TonnesCo2ePerYear;
export { calculateTransportMarchandisesSobrieteLogistiqueReduction };
