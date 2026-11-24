import { z } from 'zod';
import { fractionSchema, territorySchema } from "../../application/estimate/shared-schemas.js";
import { quantity } from "../../domain/units.js";
// Source : ParametreDeterminants, lignes « % VP vers TC » et « % VP vers actif » : « Le report modal total doit être inférieur à 100% »
const TOTAL_MODAL_SHIFT_CEILING = quantity('1');
const transportPersonnesReportModalRequestSchema = z.strictObject({
    id: z.literal('transport_personnes_report_modal'),
    territory: territorySchema,
    parameters: z
        .strictObject({
        carToPublicTransportFraction: fractionSchema,
        carToActiveModesFraction: fractionSchema,
        publicTransportToActiveModesFraction: fractionSchema,
        railShareFraction: fractionSchema.optional(),
    })
        .refine(({ carToPublicTransportFraction, carToActiveModesFraction }) => {
        const totalModalShift = carToPublicTransportFraction.plus(carToActiveModesFraction);
        return totalModalShift.isLessThanOrEqualTo(TOTAL_MODAL_SHIFT_CEILING);
    }, {
        path: ['carToActiveModesFraction'],
        message: 'must be at most 100% together with carToPublicTransportFraction',
        when: ({ issues }) => issues.length === 0,
    }),
});
export { transportPersonnesReportModalRequestSchema };
//# sourceMappingURL=transport-personnes-report-modal-request.js.map