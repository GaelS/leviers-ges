import { Result } from 'neverthrow';
import { readTransportInputs } from "../../../application/data/transport-personnes/read-transport-inputs.js";
import { resolveRailShare, } from "../../../application/data/transport-personnes/resolve-rail-share.js";
import { readThermalFleet } from "./read-thermal-fleet.js";
function getElectrificationInputs({ dataSource, territory, communes, requestedRailShare, getRegionByCommune, }) {
    return Result.combine([
        readTransportInputs({ dataSource, territory }),
        readThermalFleet({ dataSource, territory }),
        resolveRailShare({ requested: requestedRailShare, communes, getRegionByCommune }),
    ]).map(([transportInputs, thermalFleet, railShare]) => ({
        transportInputs,
        thermalFleet,
        railShare,
    }));
}
export { getElectrificationInputs };
//# sourceMappingURL=get-electrification-inputs.js.map