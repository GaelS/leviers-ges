import type BigNumber from 'bignumber.js';
import type { KgCo2ePerTonne, Tonnes } from './units.ts';
type WasteTypeTreatment = {
    readonly wasteCode: string;
    readonly storageTonnes: Tonnes;
    readonly incinerationTonnes: Tonnes;
    readonly storageEmissionFactor: KgCo2ePerTonne | undefined;
    readonly incinerationEmissionFactor: KgCo2ePerTonne | undefined;
};
declare const NO_EMISSIONS_KG: BigNumber;
export { NO_EMISSIONS_KG };
export type { WasteTypeTreatment };
