import { match } from 'ts-pattern';
const regionsDataset = 'transport-personnes/regions';
const departementsDataset = 'transport-personnes/departements';
const epcisDataset = 'transport-personnes/epcis';
function toTransportRow(dataset) {
    return (row) => ({ dataset, row });
}
function readTransportRow({ dataSource, territory, }) {
    return match(territory.level)
        .with('region', () => dataSource.row(regionsDataset, territory).map(toTransportRow(regionsDataset)))
        .with('departement', () => dataSource.row(departementsDataset, territory).map(toTransportRow(departementsDataset)))
        .with('epci', () => dataSource.row(epcisDataset, territory).map(toTransportRow(epcisDataset)))
        .exhaustive();
}
export { readTransportRow };
//# sourceMappingURL=read-transport-row.js.map