import { sum } from "../../domain/big-number.js";
import { quantity } from "../../domain/units.js";
function calculateReseauxChaleurReduction({ reductionFraction, networks, }) {
    const emissionsInTonnes = sum(networks.map((network) => network.deliveredMwh.times(network.emissionFactor)));
    return quantity(emissionsInTonnes.times(reductionFraction).toFixed());
}
export { calculateReseauxChaleurReduction };
//# sourceMappingURL=calculate-reseaux-chaleur-reduction.js.map