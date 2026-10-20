import { z } from 'zod'
import {
  fractionSchema,
  nonNegativeTonneKilometresSchema,
  territorySchema,
} from '../../application/estimate/shared-schemas.ts'
import type { ComputedLevels } from '../../domain/lever-registry.ts'
import { quantity, type Fraction } from '../../domain/units.ts'

// Source : ParametreDeterminants, lignes « report modal route vers fluvial » et « route vers ferroviaire » (marchandises) : le report total ne dépasse pas 100 % des t.km routières (choix de conception, non validé : le tableur ne pose pas de borne)
const TOTAL_FREIGHT_SHIFT_CEILING: Fraction = quantity<'Fraction'>('1')

const transportMarchandisesReportModalRequestSchema = z.strictObject({
  id: z.literal('transport_marchandises_report_modal'),
  territory: territorySchema,
  parameters: z
    .strictObject({
      roadToRailFraction: fractionSchema,
      roadToWaterwayFraction: fractionSchema,
      cyclologisticTonneKilometres: nonNegativeTonneKilometresSchema.optional(),
    })
    .refine(
      ({ roadToRailFraction, roadToWaterwayFraction }) => {
        const totalShift = roadToRailFraction.plus(roadToWaterwayFraction)
        return totalShift.isLessThanOrEqualTo(TOTAL_FREIGHT_SHIFT_CEILING)
      },
      {
        path: ['roadToWaterwayFraction'],
        message: 'must be at most 100% together with roadToRailFraction',
        when: ({ issues }) => issues.length === 0,
      },
    ),
})

type TransportMarchandisesReportModalRequestInput = z.input<
  typeof transportMarchandisesReportModalRequestSchema
>

type TransportMarchandisesReportModalRequest = z.output<
  typeof transportMarchandisesReportModalRequestSchema
> & {
  readonly territory: {
    readonly level: ComputedLevels<'transport_marchandises_report_modal'>
  }
}

export { transportMarchandisesReportModalRequestSchema }
export type {
  TransportMarchandisesReportModalRequest,
  TransportMarchandisesReportModalRequestInput,
}
