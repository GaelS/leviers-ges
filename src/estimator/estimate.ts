import { ok, type Result } from 'neverthrow'
import { match } from 'ts-pattern'
import { createEstimationContext } from '../application/estimate/create-estimation-context.ts'
import type { EstimateResult } from '../application/estimate/estimate-result.ts'
import type { EstimationError } from '../application/estimate/estimation-error.ts'
import type { DataSource } from '../domain/data-source.ts'
import {
  estimate as estimateBatimentsMachinesAgricoles,
  type BatimentsMachinesAgricolesRequestInput,
} from '../levers/batiments-machines-agricoles/index.ts'
import { type HaiesRequestInput, estimate as estimateHaies } from '../levers/haies/index.ts'
import {
  estimate as estimateProduitsBois,
  type ProduitsBoisRequestInput,
} from '../levers/produits-bois/index.ts'
import {
  estimate as estimateReseauxChaleur,
  type ReseauxChaleurRequestInput,
} from '../levers/reseaux-chaleur/index.ts'
import {
  estimate as estimateResidentielSobriete,
  type ResidentielSobrieteRequestInput,
} from '../levers/residentiel-sobriete/index.ts'
import { estimateOnComputedLevel } from './estimate-on-computed-level.ts'
import { parseRequest } from './parse-request.ts'

type RequestInput =
  | BatimentsMachinesAgricolesRequestInput
  | HaiesRequestInput
  | ProduitsBoisRequestInput
  | ReseauxChaleurRequestInput
  | ResidentielSobrieteRequestInput

type Lever = RequestInput['id']

type EstimateByLever = Record<Lever, EstimateResult>

type Estimate<L extends Lever = Lever> = EstimateByLever[L]

type Estimator = <E extends RequestInput>(input: E) => Result<Estimate<E['id']>, EstimationError>

function createEstimator(dataSource: DataSource): Estimator {
  const context = createEstimationContext(dataSource)

  function estimate<E extends RequestInput>(input: E): Result<Estimate<E['id']>, EstimationError>
  function estimate(input: RequestInput): Result<Estimate, EstimationError> {
    return parseRequest(input).andThen((request) =>
      match(request)
        .with({ id: 'batiments_machines_agricoles' }, (batimentsMachinesAgricolesRequest) =>
          estimateOnComputedLevel(batimentsMachinesAgricolesRequest, (computedLevelRequest) =>
            estimateBatimentsMachinesAgricoles(computedLevelRequest, context),
          ),
        )
        .with({ id: 'haies' }, (haiesRequest) => ok(estimateHaies(haiesRequest)))
        .with({ id: 'produits_bois' }, (produitsBoisRequest) =>
          estimateOnComputedLevel(produitsBoisRequest, (computedLevelRequest) =>
            estimateProduitsBois(computedLevelRequest, context),
          ),
        )
        .with({ id: 'reseaux_chaleur' }, (reseauxChaleurRequest) =>
          estimateOnComputedLevel(reseauxChaleurRequest, (computedLevelRequest) =>
            estimateReseauxChaleur(computedLevelRequest, context),
          ),
        )
        .with({ id: 'residentiel_sobriete' }, (residentielSobrieteRequest) =>
          estimateOnComputedLevel(residentielSobrieteRequest, (computedLevelRequest) =>
            estimateResidentielSobriete(computedLevelRequest, context),
          ),
        )
        .exhaustive(),
    )
  }

  return estimate
}

export { createEstimator }
export type { Estimate, Estimator, Lever, RequestInput }
