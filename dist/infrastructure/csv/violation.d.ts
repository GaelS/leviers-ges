import { type InvalidDataset, type InvalidDatasetReason } from '../../domain/data-source.ts';
type Violation = {
    readonly reason: InvalidDatasetReason;
    readonly detail: string;
};
declare function violation(reason: InvalidDatasetReason, detail: string): Violation;
declare function toInvalidDataset(dataset: string): (found: Violation) => InvalidDataset;
export { toInvalidDataset, violation };
export type { Violation };
