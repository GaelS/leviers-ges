import { type HectaresPerYear, type TonnesCo2ePerYear, type Years } from '../../domain/units.ts';
import type { OccupationAreas, OccupationFactors } from './data/occupation-data.ts';
declare function calculateOccupationDesSolsStorage({ afforestationHectaresPerYear, wetlandDevelopmentHectaresPerYear, desealingHectaresPerYear, horizonYears, areas, factors, }: {
    afforestationHectaresPerYear: HectaresPerYear;
    wetlandDevelopmentHectaresPerYear: HectaresPerYear;
    desealingHectaresPerYear: HectaresPerYear;
    horizonYears: Years;
    areas: OccupationAreas;
    factors: OccupationFactors;
}): TonnesCo2ePerYear;
export { calculateOccupationDesSolsStorage };
