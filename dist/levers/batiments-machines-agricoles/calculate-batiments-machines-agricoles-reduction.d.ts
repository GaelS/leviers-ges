import type { Fraction, KgCo2ePerKwh, TonnesCo2ePerYear } from '../../domain/units.ts';
import type { AgriculturalConsumption } from './data/agricultural-consumption.ts';
type ReductionFractions = {
    readonly electricity: Fraction;
    readonly naturalGas: Fraction;
    readonly petroleumProducts: Fraction;
    readonly heat: Fraction;
};
declare function calculateBatimentsMachinesAgricolesReduction({ reductionFractions, consumption, heatEmissionFactor, }: {
    reductionFractions: ReductionFractions;
    consumption: AgriculturalConsumption;
    heatEmissionFactor: KgCo2ePerKwh;
}): TonnesCo2ePerYear;
export { calculateBatimentsMachinesAgricolesReduction };
export type { ReductionFractions };
