import { match } from 'ts-pattern';
import { readEpciWoodProduction } from "./read-epci-wood-production.js";
import { toWoodProduction } from "./to-wood-production.js";
const regionsDataset = 'produits-bois/regions';
const departementsDataset = 'produits-bois/departements';
function readRow({ dataSource, dataset, territory, }) {
    return dataSource.row(dataset, territory).andThen((row) => toWoodProduction({ dataset, row }));
}
function readTerritoryWoodProduction({ dataSource, territory, }) {
    return match(territory)
        .with({ level: 'epci' }, (epci) => readEpciWoodProduction({ dataSource, territory: epci }))
        .with({ level: 'region' }, (region) => readRow({ dataSource, dataset: regionsDataset, territory: region }))
        .with({ level: 'departement' }, (departement) => readRow({ dataSource, dataset: departementsDataset, territory: departement }))
        .exhaustive();
}
export { readTerritoryWoodProduction };
//# sourceMappingURL=read-territory-wood-production.js.map