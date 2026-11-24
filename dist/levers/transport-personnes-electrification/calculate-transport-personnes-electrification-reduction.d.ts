import { type Fraction, type PassengerKilometresPerWeek, type TonnesCo2ePerYear } from '../../domain/units.ts';
import type { ThermalFleet } from './data/thermal-fleet.ts';
type ElectrificationFractions = {
    readonly carElectrification: Fraction;
    readonly busElectrification: Fraction;
};
type TransportFlows = {
    readonly carWeeklyPassengerKm: PassengerKilometresPerWeek;
    readonly publicTransportWeeklyPassengerKm: PassengerKilometresPerWeek;
};
declare function calculateElectrifiedCarShare({ fractions, thermalFleet, }: {
    fractions: ElectrificationFractions;
    thermalFleet: ThermalFleet;
}): Fraction;
declare function calculateElectrifiedBusShare({ fractions, thermalFleet, }: {
    fractions: ElectrificationFractions;
    thermalFleet: ThermalFleet;
}): Fraction;
declare function calculateTransportPersonnesElectrificationReduction({ fractions, railShare, transportFlows, thermalFleet, }: {
    fractions: ElectrificationFractions;
    railShare: Fraction;
    transportFlows: TransportFlows;
    thermalFleet: ThermalFleet;
}): TonnesCo2ePerYear;
export { calculateElectrifiedBusShare, calculateElectrifiedCarShare, calculateTransportPersonnesElectrificationReduction, };
export type { ElectrificationFractions, TransportFlows };
