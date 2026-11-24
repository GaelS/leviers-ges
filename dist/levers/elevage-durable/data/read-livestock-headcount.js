import { Result } from 'neverthrow';
import { match } from 'ts-pattern';
import { requireQuantityColumn } from "../../../application/require-column.js";
const regionsDataset = 'elevage-durable/regions';
const departementsDataset = 'elevage-durable/departements';
// Source : data/elevage-durable/manifest.json : colonne d'effectifs de chaque type d'animal
const HEADCOUNT_COLUMN_BY_ANIMAL = {
    dairyCows: 'dairy_cows',
    otherCattle: 'other_cattle',
    sows: 'sows',
    otherPigs: 'other_pigs',
    goats: 'goats',
    sheep: 'sheep',
    horses: 'horses',
    mulesAndDonkeys: 'mules_and_donkeys',
    layingHens: 'laying_hens',
    broilers: 'broilers',
    otherPoultry: 'other_poultry',
};
function toHeadcount({ dataset, row, }) {
    const headsOf = (animalType) => requireQuantityColumn({
        dataset,
        row,
        column: HEADCOUNT_COLUMN_BY_ANIMAL[animalType],
    });
    return Result.combine([
        headsOf('dairyCows'),
        headsOf('otherCattle'),
        headsOf('sows'),
        headsOf('otherPigs'),
        headsOf('goats'),
        headsOf('sheep'),
        headsOf('horses'),
        headsOf('mulesAndDonkeys'),
        headsOf('layingHens'),
        headsOf('broilers'),
        headsOf('otherPoultry'),
    ]).map(([dairyCows, otherCattle, sows, otherPigs, goats, sheep, horses, mulesAndDonkeys, layingHens, broilers, otherPoultry,]) => ({
        dairyCows,
        otherCattle,
        sows,
        otherPigs,
        goats,
        sheep,
        horses,
        mulesAndDonkeys,
        layingHens,
        broilers,
        otherPoultry,
    }));
}
function readLivestockHeadcount({ dataSource, territory, }) {
    const dataset = match(territory.level)
        .with('region', () => regionsDataset)
        .with('departement', () => departementsDataset)
        .exhaustive();
    return dataSource.row(dataset, territory).andThen((row) => toHeadcount({ dataset, row }));
}
export { readLivestockHeadcount };
//# sourceMappingURL=read-livestock-headcount.js.map