import { KILOGRAMS_PER_TONNE } from "../../domain/mass-conversions.js";
import { quantity, } from "../../domain/units.js";
import { RAIL_FREIGHT_EMISSION_FACTOR, RAIL_SHIFT_ADDED_RAIL_RATIO, RAIL_SHIFT_AVOIDED_ROAD_RATIO, WATERWAY_FREIGHT_EMISSION_FACTOR, WATERWAY_SHIFT_ADDED_WATERWAY_RATIO, WATERWAY_SHIFT_AVOIDED_ROAD_RATIO, } from "./report-modal-constants.js";
function calculateShiftBalancePerTonneKilometre({ roadEmissionFactor, avoidedRoadRatio, addedModeEmissionFactor, addedModeRatio, }) {
    const avoidedRoadEmissions = roadEmissionFactor.times(avoidedRoadRatio);
    const addedModeEmissions = addedModeEmissionFactor.times(addedModeRatio);
    return avoidedRoadEmissions.minus(addedModeEmissions);
}
function calculateTransportMarchandisesReportModalReduction({ roadToRail, roadToWaterway, tonneKilometres, cyclologisticTonneKilometres, roadEmissionFactor, }) {
    const shiftableTonneKilometres = tonneKilometres.minus(cyclologisticTonneKilometres);
    const railBalance = calculateShiftBalancePerTonneKilometre({
        roadEmissionFactor,
        avoidedRoadRatio: RAIL_SHIFT_AVOIDED_ROAD_RATIO,
        addedModeEmissionFactor: RAIL_FREIGHT_EMISSION_FACTOR,
        addedModeRatio: RAIL_SHIFT_ADDED_RAIL_RATIO,
    });
    const waterwayBalance = calculateShiftBalancePerTonneKilometre({
        roadEmissionFactor,
        avoidedRoadRatio: WATERWAY_SHIFT_AVOIDED_ROAD_RATIO,
        addedModeEmissionFactor: WATERWAY_FREIGHT_EMISSION_FACTOR,
        addedModeRatio: WATERWAY_SHIFT_ADDED_WATERWAY_RATIO,
    });
    const railReduction = roadToRail.times(railBalance);
    const waterwayReduction = roadToWaterway.times(waterwayBalance);
    const reductionPerTonneKilometre = railReduction.plus(waterwayReduction);
    const avoidedEmissionsKg = shiftableTonneKilometres.times(reductionPerTonneKilometre);
    return quantity(avoidedEmissionsKg.dividedBy(KILOGRAMS_PER_TONNE).toFixed());
}
export { calculateTransportMarchandisesReportModalReduction };
//# sourceMappingURL=calculate-transport-marchandises-report-modal-reduction.js.map