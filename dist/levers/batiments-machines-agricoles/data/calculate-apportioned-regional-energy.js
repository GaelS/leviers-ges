import { sum } from "../../../domain/big-number.js";
import { quantity } from "../../../domain/units.js";
function sumRegionalShares(parts, selectVector) {
    const sharesOfVector = parts.map(({ share, regionalConsumption }) => selectVector(regionalConsumption).times(share));
    return quantity(sum(sharesOfVector).toFixed());
}
function calculateApportionedRegionalEnergy(parts) {
    return {
        petroleumProducts: sumRegionalShares(parts, (consumption) => consumption.petroleumProducts),
        heat: sumRegionalShares(parts, (consumption) => consumption.heat),
    };
}
export { calculateApportionedRegionalEnergy };
//# sourceMappingURL=calculate-apportioned-regional-energy.js.map