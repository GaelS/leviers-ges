import { createTerritoryIndexProvider } from "../territory-index/create-territory-index-provider.js";
function createEstimationContext(dataSource) {
    const getTerritoryIndex = createTerritoryIndexProvider(dataSource);
    return {
        dataSource,
        getCommunesOf: (territory) => getTerritoryIndex().andThen((index) => index.communesOf(territory)),
        getRegionByCommune: (commune) => getTerritoryIndex().map((index) => index.regionOf(commune)),
        getDepartementByCommune: (commune) => getTerritoryIndex().map((index) => index.departementOf(commune)),
    };
}
export { createEstimationContext };
//# sourceMappingURL=create-estimation-context.js.map