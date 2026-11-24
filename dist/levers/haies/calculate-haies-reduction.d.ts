import type { Kilometres, TCo2ePerKmPerYear, TonnesCo2ePerYear } from '../../domain/units.ts';
declare const HEDGE_STORAGE_FACTOR: TCo2ePerKmPerYear;
declare function calculateHaiesReduction(hedgeKmCreatedPerYear: Kilometres, storageFactor: TCo2ePerKmPerYear): TonnesCo2ePerYear;
export { calculateHaiesReduction, HEDGE_STORAGE_FACTOR };
