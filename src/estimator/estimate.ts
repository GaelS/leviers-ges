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
import {
  estimate as estimateDechetsModeDeTraitement,
  type DechetsModeDeTraitementRequestInput,
} from '../levers/dechets-mode-de-traitement/index.ts'
import {
  estimate as estimateDechetsSobriete,
  type DechetsSobrieteRequestInput,
} from '../levers/dechets-sobriete/index.ts'
import {
  estimate as estimateElevageDurable,
  type ElevageDurableRequestInput,
} from '../levers/elevage-durable/index.ts'
import {
  estimate as estimateFertilisationAzotee,
  type FertilisationAzoteeRequestInput,
} from '../levers/fertilisation-azotee/index.ts'
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
import {
  estimate as estimateTransportPersonnesEfficacite,
  type TransportPersonnesEfficaciteRequestInput,
} from '../levers/transport-personnes-efficacite/index.ts'
import {
  estimate as estimateTransportPersonnesElectrification,
  type TransportPersonnesElectrificationRequestInput,
} from '../levers/transport-personnes-electrification/index.ts'
import {
  estimate as estimateTransportPersonnesReportModal,
  type TransportPersonnesReportModalRequestInput,
} from '../levers/transport-personnes-report-modal/index.ts'
import {
  estimate as estimateTransportPersonnesSobrieteDeplacements,
  type TransportPersonnesSobrieteDeplacementsRequestInput,
} from '../levers/transport-personnes-sobriete-deplacements/index.ts'
import { estimateOnComputedLevel } from './estimate-on-computed-level.ts'
import { parseRequest } from './parse-request.ts'

type RequestInput =
  | BatimentsMachinesAgricolesRequestInput
  | DechetsModeDeTraitementRequestInput
  | DechetsSobrieteRequestInput
  | ElevageDurableRequestInput
  | FertilisationAzoteeRequestInput
  | HaiesRequestInput
  | ProduitsBoisRequestInput
  | ReseauxChaleurRequestInput
  | ResidentielSobrieteRequestInput
  | TransportPersonnesEfficaciteRequestInput
  | TransportPersonnesElectrificationRequestInput
  | TransportPersonnesReportModalRequestInput
  | TransportPersonnesSobrieteDeplacementsRequestInput

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
        .with({ id: 'dechets_mode_de_traitement' }, (dechetsModeDeTraitementRequest) =>
          estimateOnComputedLevel(dechetsModeDeTraitementRequest, (computedLevelRequest) =>
            estimateDechetsModeDeTraitement(computedLevelRequest, context),
          ),
        )
        .with({ id: 'dechets_sobriete' }, (dechetsSobrieteRequest) =>
          estimateOnComputedLevel(dechetsSobrieteRequest, (computedLevelRequest) =>
            estimateDechetsSobriete(computedLevelRequest, context),
          ),
        )
        .with({ id: 'elevage_durable' }, (elevageDurableRequest) =>
          estimateOnComputedLevel(elevageDurableRequest, (computedLevelRequest) =>
            estimateElevageDurable(computedLevelRequest, context),
          ),
        )
        .with({ id: 'fertilisation_azotee' }, (fertilisationAzoteeRequest) =>
          estimateOnComputedLevel(fertilisationAzoteeRequest, (computedLevelRequest) =>
            estimateFertilisationAzotee(computedLevelRequest, context),
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
        .with({ id: 'transport_personnes_efficacite' }, (transportPersonnesEfficaciteRequest) =>
          estimateOnComputedLevel(transportPersonnesEfficaciteRequest, (computedLevelRequest) =>
            estimateTransportPersonnesEfficacite(computedLevelRequest, context),
          ),
        )
        .with(
          { id: 'transport_personnes_electrification' },
          (transportPersonnesElectrificationRequest) =>
            estimateOnComputedLevel(transportPersonnesElectrificationRequest, (computedLevelRequest) =>
              estimateTransportPersonnesElectrification(computedLevelRequest, context),
            ),
        )
        .with({ id: 'transport_personnes_report_modal' }, (transportPersonnesReportModalRequest) =>
          estimateOnComputedLevel(transportPersonnesReportModalRequest, (computedLevelRequest) =>
            estimateTransportPersonnesReportModal(computedLevelRequest, context),
          ),
        )
        .with(
          { id: 'transport_personnes_sobriete_deplacements' },
          (transportPersonnesSobrieteDeplacementsRequest) =>
            estimateOnComputedLevel(
              transportPersonnesSobrieteDeplacementsRequest,
              (computedLevelRequest) =>
                estimateTransportPersonnesSobrieteDeplacements(computedLevelRequest, context),
            ),
        )
        .exhaustive(),
    )
  }

  return estimate
}

export { createEstimator }
export type { Estimate, Estimator, Lever, RequestInput }
