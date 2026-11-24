import { match } from 'ts-pattern';
import { readCampaignAverage } from "./read-campaign-average.js";
const regionsDataset = 'fertilisation-azotee/regions';
const departementsDataset = 'fertilisation-azotee/departements';
function toDelivered({ dataset, row, }) {
    return readCampaignAverage({ dataset, row }).map((tonnes) => ({ tonnes }));
}
function readNitrogenDelivered({ dataSource, territory, }) {
    return match(territory.level)
        .with('region', () => dataSource
        .row(regionsDataset, territory)
        .andThen((row) => toDelivered({ dataset: regionsDataset, row })))
        .with('departement', () => dataSource
        .row(departementsDataset, territory)
        .andThen((row) => toDelivered({ dataset: departementsDataset, row })))
        .exhaustive();
}
export { readNitrogenDelivered };
//# sourceMappingURL=read-nitrogen-delivered.js.map