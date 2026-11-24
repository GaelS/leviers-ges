import { ok } from 'neverthrow';
import { quantity } from "../../../domain/units.js";
import { areAllCommunesInRegion } from "./are-all-communes-in-region.js";
// Source : SDES, Bilan annuel des transports 2024, figures F1-4 et F2-1 : part du ferré dans les voyageurs-kilomètres de transport collectif urbain en Île-de-France, 82 % en 2024
const ILE_DE_FRANCE_RAIL_SHARE = quantity('0.82');
// Source : SDES, Bilan annuel des transports 2024, figures F1-4 et F2-1 : part du ferré hors Île-de-France, 24 % en 2024
const OTHER_REGIONS_RAIL_SHARE = quantity('0.24');
// Source : Insee, code officiel géographique : code de la région Île-de-France
const ILE_DE_FRANCE_REGION_CODE = '11';
function resolveRailShare({ requested, communes, getRegionByCommune, }) {
    if (requested !== undefined)
        return ok({ fraction: requested, defaulted: false });
    return areAllCommunesInRegion({
        communes,
        regionCode: ILE_DE_FRANCE_REGION_CODE,
        getRegionByCommune,
    }).map((isInIleDeFrance) => {
        const fraction = isInIleDeFrance ? ILE_DE_FRANCE_RAIL_SHARE : OTHER_REGIONS_RAIL_SHARE;
        return { fraction, defaulted: true };
    });
}
export { resolveRailShare };
//# sourceMappingURL=resolve-rail-share.js.map