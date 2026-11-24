function recordDatasetReads(dataSource) {
    const readDatasets = new Set();
    return {
        dataSource: {
            provenance: (dataset) => dataSource.provenance(dataset),
            constant: (dataset, name) => {
                readDatasets.add(dataset);
                return dataSource.constant(dataset, name);
            },
            row: (dataset, territory) => {
                readDatasets.add(dataset);
                return dataSource.row(dataset, territory);
            },
            rows: (dataset) => {
                readDatasets.add(dataset);
                return dataSource.rows(dataset);
            },
        },
        takeReadDatasets: () => {
            const taken = [...readDatasets];
            readDatasets.clear();
            return taken;
        },
    };
}
export { recordDatasetReads };
//# sourceMappingURL=record-dataset-reads.js.map