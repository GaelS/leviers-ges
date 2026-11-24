import { type MegawattHours, type SquareMetres } from '../../domain/units.ts';
type SurfaceContribution = {
    readonly epciSurface: SquareMetres;
    readonly departementSurface: SquareMetres;
    readonly departementConsumption: MegawattHours;
};
declare function apportionBySurface(contributions: readonly SurfaceContribution[]): MegawattHours;
export { apportionBySurface };
export type { SurfaceContribution };
