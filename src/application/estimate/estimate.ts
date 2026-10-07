import { ok, type Result } from 'neverthrow'
import { match } from 'ts-pattern'
import { roundOutput } from '../../domain/big-number.js'
import type { DataSource } from '../../domain/data-source.js'
import {
  calculateHaiesReduction,
  HEDGE_STORAGE_FACTOR,
} from '../../domain/haies/calculate-haies-reduction.js'
import { quantity, type TonnesCo2ePerYear } from '../../domain/units.js'
import { createTerritoryIndexProvider } from '../territory-index/create-territory-index-provider.js'
import { ensureLevelComputed } from './ensure-level-computed.js'
import { estimateReseauxChaleur } from './estimate-reseaux-chaleur.js'
import type { EstimationError } from './estimation-error.js'
import { parseRequest, type Lever, type Request, type RequestInput } from './request.js'

type EstimateWithoutAssumptions = {
  readonly reduction: TonnesCo2ePerYear
  readonly appliedAssumptions: Record<string, never>
}

type EstimateByLever = {
  haies: EstimateWithoutAssumptions
  reseaux_chaleur: EstimateWithoutAssumptions
}

type Estimate<L extends Lever = Lever> = L extends Lever ? EstimateByLever[L] : never

type Estimator = <E extends RequestInput>(input: E) => Result<Estimate<E['id']>, EstimationError>

function toEstimate(reduction: TonnesCo2ePerYear): Estimate {
  return {
    reduction: quantity<'TonnesCo2ePerYear'>(roundOutput(reduction).toFixed()),
    appliedAssumptions: {},
  }
}

function createEstimator(dataSource: DataSource): Estimator {
  const territoryIndex = createTerritoryIndexProvider(dataSource)

  function calculateEstimate(request: Request): Result<Estimate, EstimationError> {
    return match(request)
      .with({ id: 'haies' }, ({ parameters }) =>
        ok(toEstimate(calculateHaiesReduction(parameters.hedgeKmCreatedPerYear, HEDGE_STORAGE_FACTOR))),
      )
      .with({ id: 'reseaux_chaleur' }, (reseauxChaleurRequest) =>
        estimateReseauxChaleur({
          request: reseauxChaleurRequest,
          dataSource,
          territoryIndex: territoryIndex(),
        }).map(toEstimate),
      )
      .exhaustive()
  }

  function estimate<E extends RequestInput>(input: E): Result<Estimate<E['id']>, EstimationError>
  function estimate(input: RequestInput): Result<Estimate, EstimationError> {
    return parseRequest(input)
      .andThen((request) =>
        ensureLevelComputed({ lever: request.id, level: request.territory.level }).map(() => request),
      )
      .andThen(calculateEstimate)
  }

  return estimate
}

export { createEstimator }
export type { Estimate, Estimator }
