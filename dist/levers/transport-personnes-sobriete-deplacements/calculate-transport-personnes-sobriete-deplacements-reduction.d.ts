import { type Fraction, type KgCo2ePerPassengerKilometre, type KgCo2ePerVehicleKilometre, type PassengerKilometresPerWeek, type TonnesCo2ePerYear } from '../../domain/units.ts';
type SobrieteFlows = {
    readonly carWeeklyPassengerKm: PassengerKilometresPerWeek;
    readonly publicTransportWeeklyPassengerKm: PassengerKilometresPerWeek;
    readonly carEmissionFactor: KgCo2ePerVehicleKilometre;
    readonly busEmissionFactor: KgCo2ePerVehicleKilometre;
};
declare function calculateTransportPersonnesSobrieteDeplacementsReduction({ distanceReduction, railShare, railEmissionFactor, flows, }: {
    distanceReduction: Fraction;
    railShare: Fraction;
    railEmissionFactor: KgCo2ePerPassengerKilometre;
    flows: SobrieteFlows;
}): TonnesCo2ePerYear;
export { calculateTransportPersonnesSobrieteDeplacementsReduction };
export type { SobrieteFlows };
