import { roundOutput } from '../../domain/big-number.js'
import { quantity, type TonnesCo2ePerYear } from '../../domain/units.js'

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
