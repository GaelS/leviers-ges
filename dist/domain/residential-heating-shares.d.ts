import { type Fraction } from './units.ts';
type ResidentialEnergyVector = 'electricity' | 'naturalGas' | 'fuelOil' | 'liquefiedPetroleumGas' | 'heat';
declare const HEATING_AND_HOT_WATER_SHARE: Readonly<Record<ResidentialEnergyVector, Fraction>>;
export { HEATING_AND_HOT_WATER_SHARE };
export type { ResidentialEnergyVector };
