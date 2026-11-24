import { type ResidentialEnergyVector } from '../../domain/residential-heating-shares.ts';
import type { ResidentialConsumption } from '../../domain/residential-consumption.ts';
import type { Fraction, KgCo2ePerKwh, TonnesCo2ePerYear } from '../../domain/units.ts';
declare function calculateResidentielRenovationReduction({ renovatedParcFraction, consumption, eligibleSurfaceShare, heatEmissionFactor, }: {
    renovatedParcFraction: Fraction;
    consumption: ResidentialConsumption;
    eligibleSurfaceShare: Readonly<Record<ResidentialEnergyVector, Fraction>>;
    heatEmissionFactor: KgCo2ePerKwh;
}): TonnesCo2ePerYear;
export { calculateResidentielRenovationReduction };
