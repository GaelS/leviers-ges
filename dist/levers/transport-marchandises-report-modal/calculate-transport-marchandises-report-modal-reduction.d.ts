import { type Fraction, type KgCo2ePerTonneKilometre, type TonneKilometres, type TonnesCo2ePerYear } from '../../domain/units.ts';
declare function calculateTransportMarchandisesReportModalReduction({ roadToRail, roadToWaterway, tonneKilometres, cyclologisticTonneKilometres, roadEmissionFactor, }: {
    roadToRail: Fraction;
    roadToWaterway: Fraction;
    tonneKilometres: TonneKilometres;
    cyclologisticTonneKilometres: TonneKilometres;
    roadEmissionFactor: KgCo2ePerTonneKilometre;
}): TonnesCo2ePerYear;
export { calculateTransportMarchandisesReportModalReduction };
