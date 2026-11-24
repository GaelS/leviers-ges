import { type Fraction, type KgCo2ePerVehicleKilometre, type PassengerKilometresPerWeek, type RelativeChange, type TonnesCo2ePerYear } from '../../domain/units.ts';
type EfficiencyFractions = {
    readonly carEcodrivingApplication: Fraction;
    readonly busEcodrivingApplication: Fraction;
    readonly carPassengerIncrease: RelativeChange;
    readonly busPassengerIncrease: RelativeChange;
};
type TransportFlows = {
    readonly carWeeklyPassengerKm: PassengerKilometresPerWeek;
    readonly publicTransportWeeklyPassengerKm: PassengerKilometresPerWeek;
    readonly carEmissionFactor: KgCo2ePerVehicleKilometre;
    readonly busEmissionFactor: KgCo2ePerVehicleKilometre;
};
declare const ECODRIVING_POTENTIAL: Fraction;
declare function calculateTransportPersonnesEfficaciteReduction({ fractions, railShare, transportInputs, }: {
    fractions: EfficiencyFractions;
    railShare: Fraction;
    transportInputs: TransportFlows;
}): TonnesCo2ePerYear;
export { calculateTransportPersonnesEfficaciteReduction, ECODRIVING_POTENTIAL, };
export type { EfficiencyFractions };
