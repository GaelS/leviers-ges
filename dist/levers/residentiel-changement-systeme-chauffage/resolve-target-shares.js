import { err, ok } from 'neverthrow';
import { invalidRequest } from "../../application/estimate/estimation-error.js";
import { sum } from "../../domain/big-number.js";
import { quantity } from "../../domain/units.js";
// Source : choix de conception de ce dépôt, non validé : une part non précisée vaut 0 quand il n'y a rien à répartir
const NO_SHARE = quantity('0');
// Source : choix de conception de ce dépôt, non validé : une seule part non précisée prend tout le reste, la somme des parts cibles valant 100 % (PlanET V1, Residentiel_ChgtSyst!B15)
const SINGLE_SHARE_COUNT = 1;
// Source : PlanET V1, Residentiel_ChgtSyst!B15 : la somme des parts cibles vaut 100 %
const WHOLE = quantity('1');
function resolveTargetShares({ requested, current, }) {
    const vectors = ['electricity', 'naturalGas', 'fuelOil', 'wood', 'heat'];
    const givenTotal = sum(vectors.map((vector) => requested[vector] ?? NO_SHARE));
    const remainder = WHOLE.minus(givenTotal);
    const unspecifiedCount = vectors.filter((vector) => requested[vector] === undefined).length;
    const unspecifiedCurrentTotal = sum(vectors.map((vector) => (requested[vector] === undefined ? current.shares[vector] : NO_SHARE)));
    const hasNothingToShare = current.usefulEnergy.isZero() || remainder.isZero();
    const hasSingleUnspecifiedShare = unspecifiedCount === SINGLE_SHARE_COUNT;
    if (!hasNothingToShare && !hasSingleUnspecifiedShare && unspecifiedCurrentTotal.isZero())
        return err(invalidRequest([
            {
                parameter: 'parameters',
                message: 'the unspecified target shares have no current use to share the remaining part of the energy: give all but one of them',
            },
        ]));
    const sharedShareOf = (vector) => {
        if (hasSingleUnspecifiedShare)
            return quantity(remainder.toFixed());
        const shareOfRemainder = current.shares[vector].times(remainder);
        return quantity(shareOfRemainder.dividedBy(unspecifiedCurrentTotal).toFixed());
    };
    const shareOf = (vector) => requested[vector] ?? (hasNothingToShare ? NO_SHARE : sharedShareOf(vector));
    return ok({
        electricity: shareOf('electricity'),
        naturalGas: shareOf('naturalGas'),
        fuelOil: shareOf('fuelOil'),
        wood: shareOf('wood'),
        heat: shareOf('heat'),
    });
}
export { resolveTargetShares };
//# sourceMappingURL=resolve-target-shares.js.map