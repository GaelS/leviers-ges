import { sum } from "../../../domain/big-number.js";
import { quantity } from "../../../domain/units.js";
function calculateRegionalAreaShares({ areas, territoryCommunes, }) {
    const shareEntries = [...Map.groupBy(areas, (area) => area.region)]
        .map(([region, regionAreas]) => {
        const territoryAreas = regionAreas.filter((area) => territoryCommunes.has(area.commune));
        return {
            region,
            regionHectares: sum(regionAreas.map((area) => area.hectares)),
            territoryHectares: sum(territoryAreas.map((area) => area.hectares)),
        };
    })
        .filter(({ territoryHectares }) => territoryHectares.isGreaterThan(0))
        .map(({ region, regionHectares, territoryHectares }) => {
        const share = territoryHectares.dividedBy(regionHectares);
        return [region, quantity(share.toFixed())];
    });
    return new Map(shareEntries);
}
export { calculateRegionalAreaShares };
//# sourceMappingURL=calculate-regional-area-shares.js.map