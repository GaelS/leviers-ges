import { sum } from "../../domain/big-number.js";
import { convertToKgPerKwh, ELECTRICITY_APPLIED_EMISSION_FACTOR, FUEL_OIL_EMISSION_FACTOR, LIQUEFIED_PETROLEUM_GAS_EMISSION_FACTOR, NATURAL_GAS_EMISSION_FACTOR, } from "../../domain/emission-factors.js";
import { quantity } from "../../domain/units.js";
function calculateEmissions({ consumption, emissionFactor, }) {
    return quantity(consumption.times(emissionFactor).toFixed());
}
function calculateResidentielSobrieteReduction({ sobrietyFractions, consumption, heatEmissionFactor, }) {
    const electricityEmissions = calculateEmissions({
        consumption: consumption.electricity,
        emissionFactor: ELECTRICITY_APPLIED_EMISSION_FACTOR,
    });
    const naturalGasEmissions = calculateEmissions({
        consumption: consumption.naturalGas,
        emissionFactor: convertToKgPerKwh(NATURAL_GAS_EMISSION_FACTOR),
    });
    const fuelOilEmissions = calculateEmissions({
        consumption: consumption.fuelOil,
        emissionFactor: convertToKgPerKwh(FUEL_OIL_EMISSION_FACTOR),
    });
    const liquefiedPetroleumGasEmissions = calculateEmissions({
        consumption: consumption.liquefiedPetroleumGas,
        emissionFactor: convertToKgPerKwh(LIQUEFIED_PETROLEUM_GAS_EMISSION_FACTOR),
    });
    const heatEmissions = calculateEmissions({
        consumption: consumption.heat,
        emissionFactor: heatEmissionFactor,
    });
    const emissionsByVector = [
        electricityEmissions,
        naturalGasEmissions,
        fuelOilEmissions,
        liquefiedPetroleumGasEmissions,
        heatEmissions,
    ];
    const totalEmissions = sum(emissionsByVector);
    const reductionShare = sobrietyFractions.households.times(sobrietyFractions.consumptionReduction);
    const avoidedEmissions = totalEmissions.times(reductionShare);
    return quantity(avoidedEmissions.toFixed());
}
export { calculateResidentielSobrieteReduction };
//# sourceMappingURL=calculate-residentiel-sobriete-reduction.js.map