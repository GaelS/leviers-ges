import type { WasteTypeTreatment } from '../../../domain/waste-treatment.ts';
import type { AppliedAssumptions } from '../../estimate/estimate-result.ts';
declare function toWasteAssumptions(wasteTypes: readonly WasteTypeTreatment[]): AppliedAssumptions;
export { toWasteAssumptions };
