import { type Fraction } from '../../../domain/units.ts';
import type { AgriculturalConsumption } from './agricultural-consumption.ts';
type RegionalPart = {
    readonly share: Fraction;
    readonly regionalConsumption: AgriculturalConsumption;
};
type ApportionedEnergy = Pick<AgriculturalConsumption, 'petroleumProducts' | 'heat'>;
declare function calculateApportionedRegionalEnergy(parts: readonly RegionalPart[]): ApportionedEnergy;
export { calculateApportionedRegionalEnergy };
export type { ApportionedEnergy, RegionalPart };
