import { Result } from 'neverthrow';
import { calculateApportionedRegionalEnergy, } from "./calculate-apportioned-regional-energy.js";
import { calculateRegionalAreaShares } from "./calculate-regional-area-shares.js";
import { readLocalEnergy } from "./read-local-energy.js";
import { readLocatedAreas } from "./read-located-areas.js";
import { findRegionalConsumption, readRegionalEnergy, } from "./read-regional-energy.js";
function toRegionalParts({ shares, regionalEnergy, }) {
    return Result.combine([...shares].map(([region, share]) => findRegionalConsumption({ regionalEnergy, region }).map((regionalConsumption) => ({
        share,
        regionalConsumption,
    }))));
}
function getAgriculturalConsumption({ dataSource, territory, communes, getRegionByCommune, }) {
    return Result.combine([
        readRegionalEnergy(dataSource),
        readLocatedAreas({ dataSource, getRegionByCommune }),
    ]).andThen(([regionalEnergy, locatedAreas]) => {
        const shares = calculateRegionalAreaShares({
            areas: locatedAreas,
            territoryCommunes: new Set(communes),
        });
        return Result.combine([
            readLocalEnergy({ dataSource, territory, regionalEnergy }),
            toRegionalParts({ shares, regionalEnergy }).map(calculateApportionedRegionalEnergy),
        ]).map(([localEnergy, apportionedEnergy]) => ({ ...localEnergy, ...apportionedEnergy }));
    });
}
export { getAgriculturalConsumption };
//# sourceMappingURL=get-agricultural-consumption.js.map