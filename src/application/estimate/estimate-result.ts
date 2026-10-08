import { roundOutput } from '../../domain/big-number.ts'
import { quantity, type TonnesCo2ePerYear } from '../../domain/units.ts'

type EstimateResult = {
  readonly reduction: TonnesCo2ePerYear
  readonly appliedAssumptions: Record<string, never>
}

function toEstimateResult(reduction: TonnesCo2ePerYear): EstimateResult {
  return {
    reduction: quantity<'TonnesCo2ePerYear'>(roundOutput(reduction).toFixed()),
    appliedAssumptions: {},
  }
}

export { toEstimateResult }
export type { EstimateResult }
