import { type Fraction } from '../../domain/units.ts';
type HeatingVector = 'electricity' | 'naturalGas' | 'fuelOil' | 'wood' | 'heat';
declare const CURRENT_EFFICIENCY: Readonly<Record<HeatingVector, Fraction>>;
declare const TARGET_EFFICIENCY: Readonly<Record<HeatingVector, Fraction>>;
export { CURRENT_EFFICIENCY, TARGET_EFFICIENCY };
export type { HeatingVector };
