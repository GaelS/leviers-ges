import { Result } from 'neverthrow';
import { resolveRailEmissionFactor } from "./resolve-rail-emission-factor.js";
import { readTransportInputs } from "./read-transport-inputs.js";
import { resolveRailShare, } from "./resolve-rail-share.js";
function getPassengerTransportInputs({ dataSource, territory, communes, requestedRailShare, getRegionByCommune, }) {
    return Result.combine([
        readTransportInputs({ dataSource, territory }),
        resolveRailShare({ requested: requestedRailShare, communes, getRegionByCommune }),
        resolveRailEmissionFactor({ communes, getRegionByCommune }),
    ]).map(([transportInputs, railShare, railEmissionFactor]) => ({
        transportInputs,
        railShare,
        railEmissionFactor,
    }));
}
export { getPassengerTransportInputs };
//# sourceMappingURL=get-passenger-transport-inputs.js.map