import { sum, toBig } from "../../domain/big-number.js";
import { quantity } from "../../domain/units.js";
// Source : choix de conception, non validé : un département dont la SAU hors bio est nulle ou négative (Paris et Hauts-de-Seine : bio 2024 supérieure à la SAU 2020) ne peut pas être ventilé ; l'EPCI n'en reçoit rien
const NO_SHARE = toBig('0');
// Source : choix de conception, non validé : la part d'un EPCI dans l'azote d'un département est plafonnée à 1, la bio d'un EPCI sous secret statistique n'étant pas dans celle du département
const WHOLE_DEPARTEMENT = toBig('1');
function toNonNegative(area) {
    return area.isNegative() ? NO_SHARE : area;
}
function toDepartementShare(part) {
    const departementConventionalArea = part.departementArea.minus(part.departementOrganicArea);
    if (departementConventionalArea.isLessThanOrEqualTo(NO_SHARE))
        return NO_SHARE;
    const epciConventionalArea = toNonNegative(part.epciArea.minus(part.epciOrganicArea));
    const share = epciConventionalArea.dividedBy(departementConventionalArea);
    return share.isGreaterThan(WHOLE_DEPARTEMENT) ? WHOLE_DEPARTEMENT : share;
}
function calculateEpciDeliveredNitrogen(parts) {
    const apportioned = parts.map((part) => part.departementDelivered.times(toDepartementShare(part)));
    return quantity(sum(apportioned).toFixed());
}
export { calculateEpciDeliveredNitrogen };
//# sourceMappingURL=calculate-epci-delivered-nitrogen.js.map