import { type Result } from 'neverthrow';
import type { Level, Territory } from './territory.ts';
type Commune = {
    readonly code: string;
    readonly epci: string | undefined;
    readonly departement: string;
    readonly region: string;
};
type UnknownTerritory = {
    readonly kind: 'unknown_territory';
    readonly level: Level;
    readonly code: string;
};
interface TerritoryIndex {
    communesOf(territory: Territory<Level>): Result<readonly string[], UnknownTerritory>;
    departementsOf(epci: Territory<'epci'>): Result<readonly string[], UnknownTerritory>;
    regionOf(commune: string): string | undefined;
    departementOf(commune: string): string | undefined;
}
declare function buildTerritoryIndex(communes: readonly Commune[]): TerritoryIndex;
export { buildTerritoryIndex };
export type { Commune, TerritoryIndex, UnknownTerritory };
