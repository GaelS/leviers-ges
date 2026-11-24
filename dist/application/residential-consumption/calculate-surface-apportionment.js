import { sum, toBig } from "../../domain/big-number.js";
import { quantity } from "../../domain/units.js";
// Source : choix de conception, non validé : un département sans surface chauffée avec ce combustible n'apporte aucune consommation à l'EPCI plutôt qu'une division par zéro
const NO_SURFACE_SHARE = toBig('0');
function toSurfaceShare({ epciSurface, departementSurface }) {
    return departementSurface.isZero() ? NO_SURFACE_SHARE : epciSurface.dividedBy(departementSurface);
}
function apportionBySurface(contributions) {
    const shares = contributions.map((contribution) => contribution.departementConsumption.times(toSurfaceShare(contribution)));
    return quantity(sum(shares).toFixed());
}
export { apportionBySurface };
//# sourceMappingURL=calculate-surface-apportionment.js.map