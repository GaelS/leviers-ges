import { sum, toBig } from "../../../domain/big-number.js";
import { quantity } from "../../../domain/units.js";
// Source : choix de conception, non validé : un département sans forêt (Paris, 75) n'apporte aucune récolte à l'EPCI plutôt qu'une division par zéro
const NO_FOREST_SHARE = toBig('0');
function toForestShare({ epciForest, departementForest }) {
    return departementForest.isZero() ? NO_FOREST_SHARE : epciForest.dividedBy(departementForest);
}
function apportionWoodProduction(contributions) {
    const weighted = contributions.map((contribution) => ({
        production: contribution.departementProduction,
        share: toForestShare(contribution),
    }));
    const logs = weighted.map(({ production, share }) => production.logs.times(share));
    const industrialWood = weighted.map(({ production, share }) => production.industrialWood.times(share));
    return {
        logs: quantity(sum(logs).toFixed()),
        industrialWood: quantity(sum(industrialWood).toFixed()),
    };
}
export { apportionWoodProduction };
//# sourceMappingURL=apportion-wood-production.js.map