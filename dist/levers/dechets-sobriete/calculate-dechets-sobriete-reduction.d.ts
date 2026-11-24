import { type Fraction, type TonnesCo2ePerYear } from '../../domain/units.ts';
import { type WasteTypeTreatment } from '../../domain/waste-treatment.ts';
type WasteReductions = {
    readonly storage: Fraction;
    readonly incineration: Fraction;
};
declare function calculateDechetsSobrieteReduction({ reductions, wasteTypes, }: {
    reductions: WasteReductions;
    wasteTypes: readonly WasteTypeTreatment[];
}): TonnesCo2ePerYear;
export { calculateDechetsSobrieteReduction };
export type { WasteReductions };
