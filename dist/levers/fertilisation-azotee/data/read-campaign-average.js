import { Result } from 'neverthrow';
import { requireQuantityColumn } from "../../../application/require-column.js";
import { toBig } from "../../../domain/big-number.js";
import { quantity } from "../../../domain/units.js";
// Source : hypothèse nommée nitrogenCampaigns (docs/methodology/assumptions.md) : la masse livrée à un territoire est la moyenne de deux campagnes, 2022-2023 révisée et 2023-2024 ; DonneesTerritoires!D8 : « Prendre la moyenne sur 2 ans »
const CAMPAIGN_COUNT = toBig('2');
function readCampaignAverage({ dataset, row, }) {
    return Result.combine([
        requireQuantityColumn({ dataset, row, column: 'nitrogen_delivered_tonnes_2022_2023' }),
        requireQuantityColumn({ dataset, row, column: 'nitrogen_delivered_tonnes_2023_2024' }),
    ]).map(([previousCampaign, latestCampaign]) => {
        const bothCampaigns = previousCampaign.plus(latestCampaign);
        return quantity(bothCampaigns.dividedBy(CAMPAIGN_COUNT).toFixed());
    });
}
export { readCampaignAverage };
//# sourceMappingURL=read-campaign-average.js.map