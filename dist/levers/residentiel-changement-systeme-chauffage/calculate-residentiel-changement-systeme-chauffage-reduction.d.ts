import type { ResidentialConsumption } from '../../domain/residential-consumption.ts';
import type { Fraction, KgCo2ePerKwh, MegawattHours, TonnesCo2ePerYear } from '../../domain/units.ts';
import { type HeatingVector } from './heating-reference.ts';
type TargetShares = Readonly<Record<HeatingVector, Fraction>>;
type CurrentUsefulShares = {
    readonly usefulEnergy: MegawattHours;
    readonly shares: TargetShares;
};
declare function calculateCurrentUsefulShares(consumption: ResidentialConsumption): CurrentUsefulShares;
declare function calculateResidentielChangementSystemeChauffageReduction({ targetShares, consumption, heatEmissionFactor, }: {
    targetShares: TargetShares;
    consumption: ResidentialConsumption;
    heatEmissionFactor: KgCo2ePerKwh;
}): TonnesCo2ePerYear;
export { calculateCurrentUsefulShares, calculateResidentielChangementSystemeChauffageReduction };
export type { CurrentUsefulShares, TargetShares };
