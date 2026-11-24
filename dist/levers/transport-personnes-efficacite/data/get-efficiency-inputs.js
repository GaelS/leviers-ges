import { Result } from 'neverthrow';
import { readTransportInputs } from "../../../application/data/transport-personnes/read-transport-inputs.js";
import { resolveRailShare, } from "../../../application/data/transport-personnes/resolve-rail-share.js";
function getEfficiencyInputs({ dataSource, territory, communes, requestedRailShare, getRegionByCommune, }) {
    return Result.combine([
        readTransportInputs({ dataSource, territory }),
        resolveRailShare({ requested: requestedRailShare, communes, getRegionByCommune }),
    ]).map(([transportInputs, railShare]) => ({ transportInputs, railShare }));
}
export { getEfficiencyInputs };
//# sourceMappingURL=get-efficiency-inputs.js.map