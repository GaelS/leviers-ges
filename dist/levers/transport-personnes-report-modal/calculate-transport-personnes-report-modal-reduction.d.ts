import { type Fraction, type KgCo2ePerPassengerKilometre, type KgCo2ePerVehicleKilometre, type PassengerKilometresPerWeek, type TonnesCo2ePerYear } from '../../domain/units.ts';
type ReportModalFractions = {
    readonly carToPublicTransport: Fraction;
    readonly carToActiveModes: Fraction;
    readonly publicTransportToActiveModes: Fraction;
};
type ReportModalFlows = {
    readonly carWeeklyPassengerKm: PassengerKilometresPerWeek;
    readonly publicTransportWeeklyPassengerKm: PassengerKilometresPerWeek;
    readonly carEmissionFactor: KgCo2ePerVehicleKilometre;
    readonly busEmissionFactor: KgCo2ePerVehicleKilometre;
};
declare function calculateTransportPersonnesReportModalReduction({ fractions, railShare, railEmissionFactor, flows, }: {
    fractions: ReportModalFractions;
    railShare: Fraction;
    railEmissionFactor: KgCo2ePerPassengerKilometre;
    flows: ReportModalFlows;
}): TonnesCo2ePerYear;
export { calculateTransportPersonnesReportModalReduction };
export type { ReportModalFlows, ReportModalFractions };
