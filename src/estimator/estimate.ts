import { err, type Result } from 'neverthrow'
import { match } from 'ts-pattern'
import { createEstimationContext } from '../application/estimate/create-estimation-context.ts'
import type { EstimateResult } from '../application/estimate/estimate-result.ts'
import { invalidRequest, type EstimationError } from '../application/estimate/estimation-error.ts'
import type { DataSource } from '../domain/data-source.ts'
import { estimate as estimateHaies, type HaiesRequestInput } from '../levers/haies/index.ts'
import {
  estimate as estimateReseauxChaleur,
  type ReseauxChaleurRequestInput,
} from '../levers/reseaux-chaleur/index.ts'

type RequestInput = HaiesRequestInput | ReseauxChaleurRequestInput

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
  const context = createEstimationContext(dataSource)

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
