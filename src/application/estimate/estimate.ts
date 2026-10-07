import type { Result } from 'neverthrow'
import { match } from 'ts-pattern'
import { roundOutput } from '../../domain/big-number.js'
import {
  calculateHaiesReduction,
  HEDGE_STORAGE_FACTOR,
} from '../../domain/haies/calculate-haies-reduction.js'
import { quantity, type TonnesCo2ePerYear } from '../../domain/units.js'
import { ensureLevelComputed } from './ensure-level-computed.js'
import type { EstimationError } from './estimation-error.js'
import { parseRequest, type Lever, type Request, type RequestInput } from './request.js'

type EstimateByLever = {
  haies: {
    readonly reduction: TonnesCo2ePerYear
    readonly appliedAssumptions: Record<string, never>
  }
}

type Estimate<L extends Lever = Lever> = L extends Lever ? EstimateByLever[L] : never

function roundReduction(reduction: TonnesCo2ePerYear): TonnesCo2ePerYear {
  return quantity<'TonnesCo2ePerYear'>(roundOutput(reduction).toFixed())
}

function calculateEstimate(request: Request): Estimate {
  return match(request)
    .with({ id: 'haies' }, ({ parameters }) => ({
      reduction: roundReduction(
        calculateHaiesReduction(parameters.hedgeKmCreatedPerYear, HEDGE_STORAGE_FACTOR),
      ),
      appliedAssumptions: {},
    }))
    .exhaustive()
}

function estimate<E extends RequestInput>(input: E): Result<Estimate<E['id']>, EstimationError>
function estimate(input: RequestInput): Result<Estimate, EstimationError> {
  return parseRequest(input)
    .andThen((request) =>
      ensureLevelComputed({ lever: request.id, level: request.territory.level }).map(() => request),
    )
    .map(calculateEstimate)
}

export { estimate }
export type { Estimate }
