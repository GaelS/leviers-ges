import { err, type Result } from 'neverthrow'
import { match } from 'ts-pattern'
import type { EstimateResult } from '../application/estimate/estimate-result.js'
import type { EstimationContext } from '../application/estimate/estimation-context.js'
import { invalidRequest, type EstimationError } from '../application/estimate/estimation-error.js'
import { createTerritoryIndexProvider } from '../application/territory-index/create-territory-index-provider.js'
import type { DataSource } from '../domain/data-source.js'
import { estimate as estimateHaies } from '../levers/haies/index.js'
import { estimate as estimateReseauxChaleur } from '../levers/reseaux-chaleur/index.js'

type RequestInput =
  | Parameters<typeof estimateHaies>[0]
  | Parameters<typeof estimateReseauxChaleur>[0]

type Lever = RequestInput['id']

type EstimateByLever = Record<Lever, EstimateResult>

type Estimate<L extends Lever = Lever> = EstimateByLever[L]

type Estimator = <E extends RequestInput>(input: E) => Result<Estimate<E['id']>, EstimationError>

const routedLevers: Readonly<Record<Lever, true>> = { haies: true, reseaux_chaleur: true }

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input)
}

function isRoutedLever(input: unknown): input is RequestInput {
  return isRecord(input) && typeof input['id'] === 'string' && Object.hasOwn(routedLevers, input['id'])
}

function invalidRequestShape(input: unknown): EstimationError {
  return isRecord(input)
    ? invalidRequest([{ parameter: 'id', message: 'unknown lever' }])
    : invalidRequest([{ parameter: 'request', message: 'expected an object' }])
}

function createEstimator(dataSource: DataSource): Estimator {
  const context: EstimationContext = {
    dataSource,
    territoryIndex: createTerritoryIndexProvider(dataSource),
  }

  function estimate<E extends RequestInput>(input: E): Result<Estimate<E['id']>, EstimationError>
  function estimate(input: RequestInput): Result<Estimate, EstimationError> {
    if (!isRoutedLever(input)) return err(invalidRequestShape(input))
    return match(input)
      .with({ id: 'haies' }, (haiesInput) => estimateHaies(haiesInput))
      .with({ id: 'reseaux_chaleur' }, (reseauxChaleurInput) =>
        estimateReseauxChaleur(reseauxChaleurInput, context),
      )
      .exhaustive()
  }

  return estimate
}

export { createEstimator }
export type { Estimate, Estimator, Lever, RequestInput }
