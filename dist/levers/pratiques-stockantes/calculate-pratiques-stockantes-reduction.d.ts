import type { Hectares, TonnesCo2ePerYear } from '../../domain/units.ts';
type StockingPracticeSurfaces = {
    readonly intermediateCrops: Hectares;
    readonly permanentVineyardGrassing: Hectares;
    readonly winterIntercropVineyard: Hectares;
    readonly agroforestry: Hectares;
    readonly temporaryGrasslandExtension: Hectares;
};
declare function calculatePratiquesStockantesReduction(surfaces: StockingPracticeSurfaces): TonnesCo2ePerYear;
export { calculatePratiquesStockantesReduction };
export type { StockingPracticeSurfaces };
