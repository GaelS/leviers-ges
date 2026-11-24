import { type Fraction, type Hectares } from '../../../domain/units.ts';
type LocatedArea = {
    readonly commune: string;
    readonly region: string;
    readonly hectares: Hectares;
};
declare function calculateRegionalAreaShares({ areas, territoryCommunes, }: {
    areas: readonly LocatedArea[];
    territoryCommunes: ReadonlySet<string>;
}): ReadonlyMap<string, Fraction>;
export { calculateRegionalAreaShares };
export type { LocatedArea };
