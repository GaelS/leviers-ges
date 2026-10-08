import { err, ok, type Result } from 'neverthrow'
import { match } from 'ts-pattern'
import { z } from 'zod'
import { createEstimationContext } from '../application/estimate/create-estimation-context.ts'
import type { EstimateResult } from '../application/estimate/estimate-result.ts'
import { invalidRequest, type EstimationError } from '../application/estimate/estimation-error.ts'
import type { DataSource } from '../domain/data-source.ts'
import {
  estimate as estimateBatimentsMachinesAgricoles,
  type BatimentsMachinesAgricolesRequestInput,
} from '../levers/batiments-machines-agricoles/index.ts'
import { estimate as estimateHaies, type HaiesRequestInput } from '../levers/haies/index.ts'
import {
  estimate as estimateReseauxChaleur,
  type ReseauxChaleurRequestInput,
} from '../levers/reseaux-chaleur/index.ts'

type RequestInput =
  | BatimentsMachinesAgricolesRequestInput
  | HaiesRequestInput
  | ReseauxChaleurRequestInput

type Lever = RequestInput['id']

type EstimateByLever = Record<Lever, EstimateResult>

type Estimate<L extends Lever = Lever> = EstimateByLever[L]

type Estimator = <E extends RequestInput>(input: E) => Result<Estimate<E['id']>, EstimationError>

const routedLeverIds = ['batiments_machines_agricoles', 'haies', 'reseaux_chaleur'] as const satisfies readonly Lever[]

const routedLeverSchema = z.looseObject(
  { id: z.enum(routedLeverIds, { error: 'unknown lever' }) },
  { error: 'expected an object' },
)

function parseRoutedLever(input: RequestInput): Result<RequestInput, EstimationError> {
  const parsed = routedLeverSchema.safeParse(input)
  if (parsed.success) return ok(input)
  return err(
    invalidRequest(
      parsed.error.issues.map((issue) => ({
        parameter: issue.path.length === 0 ? 'request' : issue.path.map(String).join('.'),
        message: issue.message,
      })),
    ),
  )
}

function createEstimator(dataSource: DataSource): Estimator {
  const context = createEstimationContext(dataSource)

  function estimate<E extends RequestInput>(input: E): Result<Estimate<E['id']>, EstimationError>
  function estimate(input: RequestInput): Result<Estimate, EstimationError> {
    return parseRoutedLever(input).andThen((routedInput) =>
      match(routedInput)
        .with({ id: 'batiments_machines_agricoles' }, (batimentsMachinesAgricolesInput) =>
          estimateBatimentsMachinesAgricoles(batimentsMachinesAgricolesInput, context),
        )
        .with({ id: 'haies' }, (haiesInput) => estimateHaies(haiesInput))
        .with({ id: 'reseaux_chaleur' }, (reseauxChaleurInput) =>
          estimateReseauxChaleur(reseauxChaleurInput, context),
        )
        .exhaustive(),
    )
  }

  return estimate
}

export { createEstimator, routedLeverIds }
export type { Estimate, Estimator, Lever, RequestInput }
