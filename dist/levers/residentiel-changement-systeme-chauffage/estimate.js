import { toEstimateResult, } from "../../application/estimate/estimate-result.js";
import { getResidentialInputs } from "../../application/residential-consumption/get-residential-inputs.js";
import { calculateCurrentUsefulShares, calculateResidentielChangementSystemeChauffageReduction, } from "./calculate-residentiel-changement-systeme-chauffage-reduction.js";
import { NATIONAL_HEATING_SHARES_ASSUMPTION } from "./national-heating-shares-assumption.js";
import { resolveTargetShares } from "./resolve-target-shares.js";
import { UNSPECIFIED_TARGET_SHARES_ASSUMPTION } from "./unspecified-target-shares-assumption.js";
function estimate({ territory, parameters }, { dataSource, getCommunesOf }) {
    const requested = {
        electricity: parameters.targetElectricityShareFraction,
        naturalGas: parameters.targetNaturalGasShareFraction,
        fuelOil: parameters.targetFuelOilShareFraction,
        wood: parameters.targetWoodShareFraction,
        heat: parameters.targetHeatNetworkShareFraction,
    };
    const hasUnspecifiedShare = Object.values(requested).some((share) => share === undefined);
    return getCommunesOf(territory)
        .andThen((communes) => getResidentialInputs({ dataSource, territory, communes }))
        .andThen(({ consumption, heatEmissionFactor }) => resolveTargetShares({ requested, current: calculateCurrentUsefulShares(consumption) }).map((targetShares) => toEstimateResult(calculateResidentielChangementSystemeChauffageReduction({
        targetShares,
        consumption,
        heatEmissionFactor,
    }), {
        nationalHeatingShares: NATIONAL_HEATING_SHARES_ASSUMPTION,
        ...(hasUnspecifiedShare ? { unspecifiedTargetShares: UNSPECIFIED_TARGET_SHARES_ASSUMPTION } : {}),
    })));
}
export { estimate };
//# sourceMappingURL=estimate.js.map