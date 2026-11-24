import type { Fraction, KgCo2ePerKwh, TonnesCo2ePerYear } from '../../domain/units.ts';
import type { ResidentialConsumption } from '../../domain/residential-consumption.ts';
type SobrietyFractions = {
    readonly households: Fraction;
    readonly consumptionReduction: Fraction;
};
declare function calculateResidentielSobrieteReduction({ sobrietyFractions, consumption, heatEmissionFactor, }: {
    sobrietyFractions: SobrietyFractions;
    consumption: ResidentialConsumption;
    heatEmissionFactor: KgCo2ePerKwh;
}): TonnesCo2ePerYear;
export { calculateResidentielSobrieteReduction };
export type { SobrietyFractions };
