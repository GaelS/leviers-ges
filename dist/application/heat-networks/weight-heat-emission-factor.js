import { sum } from "../../domain/big-number.js";
import { quantity } from "../../domain/units.js";
// Source : choix de conception, non validé : un territoire sans réseau de chaleur n'a pas de facteur
// d'émission de la chaleur, sa contribution est nulle (décision du 2026-10-08, à arbitrer avec l'ADEME)
const NO_NETWORK_EMISSION_FACTOR = quantity('0');
function weightHeatEmissionFactor(networks) {
    const deliveredTotal = sum(networks.map((network) => network.deliveredMwh));
    if (deliveredTotal.isZero())
        return NO_NETWORK_EMISSION_FACTOR;
    const emissionsTotal = sum(networks.map((network) => network.deliveredMwh.times(network.emissionFactor)));
    return quantity(emissionsTotal.dividedBy(deliveredTotal).toFixed());
}
export { weightHeatEmissionFactor };
//# sourceMappingURL=weight-heat-emission-factor.js.map