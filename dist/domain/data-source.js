function missingData({ dataset, key }) {
    return { kind: 'missing_data', dataset, key };
}
function invalidDataset({ dataset, reason, detail, }) {
    return { kind: 'invalid_dataset', dataset, reason, detail };
}
export { invalidDataset, missingData };
//# sourceMappingURL=data-source.js.map