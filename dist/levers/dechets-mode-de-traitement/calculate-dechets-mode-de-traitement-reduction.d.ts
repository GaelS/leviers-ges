import { type Fraction, type TonnesCo2ePerYear } from '../../domain/units.ts';
import { type WasteTypeTreatment } from '../../domain/waste-treatment.ts';
type TreatmentShifts = {
    readonly storageToIncineration: Fraction;
    readonly storageToMaterialRecovery: Fraction;
    readonly incinerationToMaterialRecovery: Fraction;
};
declare function calculateDechetsModeDeTraitementReduction({ shifts, wasteTypes, }: {
    shifts: TreatmentShifts;
    wasteTypes: readonly WasteTypeTreatment[];
}): TonnesCo2ePerYear;
export { calculateDechetsModeDeTraitementReduction };
export type { TreatmentShifts };
