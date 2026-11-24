import type BigNumber from 'bignumber.js';
import type { AnimalType } from './data/animal-types.ts';
type ManureShares = {
    readonly liquid: BigNumber;
    readonly solid: BigNumber;
    readonly pasture: BigNumber;
};
type ManureConversionFactors = {
    readonly liquid: BigNumber | undefined;
    readonly solid: BigNumber;
    readonly pasture: BigNumber;
};
type AnimalParameters = {
    readonly entericEmissionFactor: BigNumber;
    readonly volatileSolids: BigNumber;
    readonly maximumMethaneCapacity: BigNumber;
    readonly nitrogenExcretion: BigNumber;
    readonly currentManureShares: ManureShares;
    readonly methaneConversionFactors: ManureConversionFactors;
    readonly canBeDigested: boolean;
};
declare const ANIMAL_PARAMETERS: Readonly<Record<AnimalType, AnimalParameters>>;
export { ANIMAL_PARAMETERS };
export type { AnimalParameters, ManureConversionFactors, ManureShares };
