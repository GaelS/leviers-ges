import { readHeatNetworks } from "../heat-networks/read-heat-networks.js";
import { weightHeatEmissionFactor } from "../heat-networks/weight-heat-emission-factor.js";
import { readResidentialConsumption } from "./read-residential-consumption.js";
const residentialHeatNetworksDataset = 'residentiel-sobriete/heat-networks';
function getResidentialInputs({ dataSource, territory, communes, }) {
    return readHeatNetworks({ dataSource, dataset: residentialHeatNetworksDataset, communes }).andThen((networks) => readResidentialConsumption({ dataSource, territory, networks }).map((consumption) => ({
        consumption,
        heatEmissionFactor: weightHeatEmissionFactor(networks),
    })));
}
export { getResidentialInputs };
//# sourceMappingURL=get-residential-inputs.js.map