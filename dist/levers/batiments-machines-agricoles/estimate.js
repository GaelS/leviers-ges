import { Result } from 'neverthrow';
import { toEstimateResult, } from "../../application/estimate/estimate-result.js";
import { readHeatEmissionFactor } from "../../application/heat-networks/read-heat-emission-factor.js";
import { reseauxChaleurNetworksDataset } from "../../application/heat-networks/read-heat-networks.js";
import { calculateBatimentsMachinesAgricolesReduction } from "./calculate-batiments-machines-agricoles-reduction.js";
import { getAgriculturalConsumption } from "./data/get-agricultural-consumption.js";
function estimate({ territory, parameters }, { dataSource, getCommunesOf, getRegionByCommune }) {
    return getCommunesOf(territory).andThen((communes) => Result.combine([
        getAgriculturalConsumption({ dataSource, territory, communes, getRegionByCommune }),
        readHeatEmissionFactor({
            dataSource,
            dataset: reseauxChaleurNetworksDataset,
            communes,
        }),
    ]).map(([consumption, heatEmissionFactor]) => toEstimateResult(calculateBatimentsMachinesAgricolesReduction({
        reductionFractions: {
            electricity: parameters.electricityReductionFraction,
            naturalGas: parameters.naturalGasReductionFraction,
            petroleumProducts: parameters.petroleumProductsReductionFraction,
            heat: parameters.heatReductionFraction,
        },
        consumption,
        heatEmissionFactor,
    }))));
}
export { estimate };
//# sourceMappingURL=estimate.js.map