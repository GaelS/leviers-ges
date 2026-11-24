import type BigNumber from 'bignumber.js';
import { type Fraction, type Heads, type TonnesCo2ePerYear } from '../../domain/units.ts';
import { type ManureShares } from './animal-parameters.ts';
import type { AnimalType } from './data/animal-types.ts';
type ManureModeShares = ManureShares & {
    readonly anaerobicDigestion: BigNumber;
};
type AnimalChange = {
    readonly animalType: AnimalType;
    readonly headcount: Heads;
    readonly headcountReduction: Fraction;
    readonly entericEmissionReduction: Fraction;
    readonly targetShares: ManureModeShares;
};
declare function calculateElevageDurableReduction(changes: readonly AnimalChange[]): TonnesCo2ePerYear;
export { calculateElevageDurableReduction };
export type { AnimalChange, ManureModeShares };
