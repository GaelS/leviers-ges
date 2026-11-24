import { ok } from 'neverthrow';
import { loadTerritoryIndex } from "./load-territory-index.js";
function createTerritoryIndexProvider(dataSource) {
    let builtIndex;
    return () => {
        if (builtIndex !== undefined)
            return ok(builtIndex);
        return loadTerritoryIndex(dataSource).map((index) => {
            builtIndex = index;
            return index;
        });
    };
}
export { createTerritoryIndexProvider };
//# sourceMappingURL=create-territory-index-provider.js.map