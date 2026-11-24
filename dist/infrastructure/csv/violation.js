import { invalidDataset, } from "../../domain/data-source.js";
function violation(reason, detail) {
    return { reason, detail };
}
function toInvalidDataset(dataset) {
    return ({ reason, detail }) => invalidDataset({ dataset, reason, detail });
}
export { toInvalidDataset, violation };
//# sourceMappingURL=violation.js.map