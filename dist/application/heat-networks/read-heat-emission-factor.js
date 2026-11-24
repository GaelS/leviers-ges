import { readHeatNetworks } from "./read-heat-networks.js";
import { weightHeatEmissionFactor } from "./weight-heat-emission-factor.js";
function readHeatEmissionFactor({ dataSource, dataset, communes, }) {
    return readHeatNetworks({ dataSource, dataset, communes }).map(weightHeatEmissionFactor);
}
export { readHeatEmissionFactor };
//# sourceMappingURL=read-heat-emission-factor.js.map