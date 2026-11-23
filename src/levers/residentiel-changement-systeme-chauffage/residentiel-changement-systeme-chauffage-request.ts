import { z } from 'zod'
import { sum } from '../../domain/big-number.ts'
import { fractionSchema, territorySchema } from '../../application/estimate/shared-schemas.ts'
import type { ComputedLevels } from '../../domain/lever-registry.ts'
import { quantity, type Fraction } from '../../domain/units.ts'

// Source : PlanET V1, Residentiel_ChgtSyst!B15 : « la modification de la part d'un système de chauffage doit engendrer la modification de la part des autres systèmes » ; la somme des parts cibles vaut donc 100 %
const TARGET_SHARES_TOTAL: Fraction = quantity<'Fraction'>('1')

const residentielChangementSystemeChauffageRequestSchema = z.strictObject({
  id: z.literal('residentiel_changement_systeme_chauffage'),
  territory: territorySchema,
  parameters: z
    .strictObject({
      targetElectricityShareFraction: fractionSchema,
      targetNaturalGasShareFraction: fractionSchema,
      targetFuelOilShareFraction: fractionSchema,
      targetWoodShareFraction: fractionSchema,
      targetHeatNetworkShareFraction: fractionSchema,
    })
    .refine(
      ({
        targetElectricityShareFraction,
        targetNaturalGasShareFraction,
        targetFuelOilShareFraction,
        targetWoodShareFraction,
        targetHeatNetworkShareFraction,
      }) => {
        const shares = [
          targetElectricityShareFraction,
          targetNaturalGasShareFraction,
          targetFuelOilShareFraction,
          targetWoodShareFraction,
          targetHeatNetworkShareFraction,
        ]
        return sum(shares).isEqualTo(TARGET_SHARES_TOTAL)
      },
      {
        path: ['targetHeatNetworkShareFraction'],
        message: 'the five target shares must add up to 100%',
        when: ({ issues }) => issues.length === 0,
      },
    ),
})

type ResidentielChangementSystemeChauffageRequestInput = z.input<
  typeof residentielChangementSystemeChauffageRequestSchema
>

type ResidentielChangementSystemeChauffageRequest = z.output<
  typeof residentielChangementSystemeChauffageRequestSchema
> & {
  readonly territory: {
    readonly level: ComputedLevels<'residentiel_changement_systeme_chauffage'>
  }
}

export { residentielChangementSystemeChauffageRequestSchema }
export type {
  ResidentielChangementSystemeChauffageRequest,
  ResidentielChangementSystemeChauffageRequestInput,
}
