import { z } from 'zod';
import { fractionSchema, territorySchema } from "../../application/estimate/shared-schemas.js";
import { quantity } from "../../domain/units.js";
// Source : Scénario global Déchets, formule « 1 − % stockés vers incinérés − % stockés vers valorisation » : la part des stockés qui change de mode ne dépasse pas 100 %
const STORED_WASTE_SHIFT_CEILING = quantity('1');
const dechetsModeDeTraitementRequestSchema = z.strictObject({
    id: z.literal('dechets_mode_de_traitement'),
    territory: territorySchema,
    parameters: z
        .strictObject({
        storageToIncinerationFraction: fractionSchema,
        storageToMaterialRecoveryFraction: fractionSchema,
        incinerationToMaterialRecoveryFraction: fractionSchema,
    })
        .refine(({ storageToIncinerationFraction, storageToMaterialRecoveryFraction }) => {
        const storedWasteShift = storageToIncinerationFraction.plus(storageToMaterialRecoveryFraction);
        return storedWasteShift.isLessThanOrEqualTo(STORED_WASTE_SHIFT_CEILING);
    }, {
        path: ['storageToMaterialRecoveryFraction'],
        message: 'must be at most 100% together with storageToIncinerationFraction',
        when: ({ issues }) => issues.length === 0,
    }),
});
export { dechetsModeDeTraitementRequestSchema };
//# sourceMappingURL=dechets-mode-de-traitement-request.js.map