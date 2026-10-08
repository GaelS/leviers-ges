import { sum } from '../../domain/big-number.ts'
import { quantity } from '../../domain/units.ts'
import type {
  Fraction,
  KgCo2ePerKwh,
  MegawattHours,
  TonnesCo2ePerYear,
} from '../../domain/units.ts'

type HeatNetwork = {
  readonly deliveredMwh: MegawattHours
  readonly emissionFactor: KgCo2ePerKwh
}

function calculateReseauxChaleurReduction({
  reductionFraction,
  networks,
}: {
  reductionFraction: Fraction
  networks: readonly HeatNetwork[]
}): TonnesCo2ePerYear {
  const emissionsInTonnes = sum(
    networks.map((network) => network.deliveredMwh.times(network.emissionFactor)),
  )
  return quantity<'TonnesCo2ePerYear'>(emissionsInTonnes.times(reductionFraction).toFixed())
}

export { calculateReseauxChaleurReduction }
export type { HeatNetwork }
