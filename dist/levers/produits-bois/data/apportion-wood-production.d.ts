import { type Hectares } from '../../../domain/units.ts';
import type { WoodProduction } from './wood-production.ts';
type DepartementContribution = {
    readonly epciForest: Hectares;
    readonly departementForest: Hectares;
    readonly departementProduction: WoodProduction;
};
declare function apportionWoodProduction(contributions: readonly DepartementContribution[]): WoodProduction;
export { apportionWoodProduction };
export type { DepartementContribution };
