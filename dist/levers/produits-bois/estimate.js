import { Result } from 'neverthrow';
import { toEstimateResult, } from "../../application/estimate/estimate-result.js";
import { calculateProduitsBoisStorage } from "./calculate-produits-bois-storage.js";
import { readNationalWood } from "./data/read-national-wood.js";
import { readTerritoryWoodProduction } from "./data/read-territory-wood-production.js";
function estimate({ territory, parameters }, { dataSource }) {
    return Result.combine([
        readTerritoryWoodProduction({ dataSource, territory }),
        readNationalWood(dataSource),
    ]).map(([territoryProduction, { production: nationalProduction, productsCarbon }]) => toEstimateResult(calculateProduitsBoisStorage({
        woodProductionIncrease: parameters.woodProductionIncrease,
        territoryProduction,
        nationalProduction,
        productsCarbon,
    })));
}
export { estimate };
//# sourceMappingURL=estimate.js.map