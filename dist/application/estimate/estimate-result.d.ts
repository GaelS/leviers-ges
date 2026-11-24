import { type TonnesCo2ePerYear } from '../../domain/units.ts';
type AppliedAssumption = {
    readonly value: string;
    readonly source: string;
    readonly limit: string;
};
type AppliedAssumptions = Readonly<Record<string, AppliedAssumption>>;
type EstimateResult = {
    readonly reduction: TonnesCo2ePerYear;
    readonly appliedAssumptions: AppliedAssumptions;
};
declare function toEstimateResult(reduction: TonnesCo2ePerYear, appliedAssumptions?: AppliedAssumptions): EstimateResult;
export { toEstimateResult };
export type { AppliedAssumption, AppliedAssumptions, EstimateResult };
