import { Result, ok } from 'neverthrow';
import { match } from 'ts-pattern';
import { computedStatusOf } from "../application/estimate/ensure-level-computed.js";
import { recordDatasetReads } from "../application/estimate/record-dataset-reads.js";
import { createEstimationContext } from "../application/estimate/create-estimation-context.js";
import { LEVER_LIMITS } from "../domain/lever-limits.js";
import { estimate as estimateBatimentsMachinesAgricoles, } from "../levers/batiments-machines-agricoles/index.js";
import { estimate as estimateDechetsModeDeTraitement, } from "../levers/dechets-mode-de-traitement/index.js";
import { estimate as estimateDechetsSobriete, } from "../levers/dechets-sobriete/index.js";
import { estimate as estimateElevageDurable, } from "../levers/elevage-durable/index.js";
import { estimate as estimateFertilisationAzotee, } from "../levers/fertilisation-azotee/index.js";
import { estimate as estimateHaies } from "../levers/haies/index.js";
import { estimate as estimateOccupationDesSols, } from "../levers/occupation-des-sols/index.js";
import { estimate as estimatePratiquesStockantes, } from "../levers/pratiques-stockantes/index.js";
import { estimate as estimateProduitsBois, } from "../levers/produits-bois/index.js";
import { estimate as estimateReseauxChaleur, } from "../levers/reseaux-chaleur/index.js";
import { estimate as estimateResidentielChangementSystemeChauffage, } from "../levers/residentiel-changement-systeme-chauffage/index.js";
import { estimate as estimateResidentielRenovation, } from "../levers/residentiel-renovation/index.js";
import { estimate as estimateResidentielSobriete, } from "../levers/residentiel-sobriete/index.js";
import { estimate as estimateTransportMarchandisesEfficacite, } from "../levers/transport-marchandises-efficacite/index.js";
import { estimate as estimateTransportMarchandisesElectrification, } from "../levers/transport-marchandises-electrification/index.js";
import { estimate as estimateTransportMarchandisesReportModal, } from "../levers/transport-marchandises-report-modal/index.js";
import { estimate as estimateTransportMarchandisesSobrieteLogistique, } from "../levers/transport-marchandises-sobriete-logistique/index.js";
import { estimate as estimateTransportPersonnesEfficacite, } from "../levers/transport-personnes-efficacite/index.js";
import { estimate as estimateTransportPersonnesElectrification, } from "../levers/transport-personnes-electrification/index.js";
import { estimate as estimateTransportPersonnesReportModal, } from "../levers/transport-personnes-report-modal/index.js";
import { estimate as estimateTransportPersonnesSobrieteDeplacements, } from "../levers/transport-personnes-sobriete-deplacements/index.js";
import { estimateOnComputedLevel } from "./estimate-on-computed-level.js";
import { parseRequest } from "./parse-request.js";
// Source : choix de conception, non validé : haies et pratiques_stockantes n'ont pas de territoire, leurs trois niveaux ont le même statut dans le registre (src/domain/lever-registry.ts)
const LEVEL_OF_TERRITORY_LESS_LEVERS = 'region';
// Source : choix de conception, non validé : le référentiel des communes sert à tous les leviers et n'entre pas dans la provenance des données d'un résultat
const TERRITORY_DATASET_PREFIX = 'territoires/';
function levelOf(request) {
    return 'territory' in request ? request.territory.level : LEVEL_OF_TERRITORY_LESS_LEVERS;
}
function createEstimator(dataSource) {
    const recorder = recordDatasetReads(dataSource);
    const context = createEstimationContext(recorder.dataSource);
    function estimate(input) {
        return parseRequest(input).andThen((request) => {
            recorder.takeReadDatasets();
            return estimateLever(request).andThen((leverEstimate) => computedStatusOf({ lever: request.id, level: levelOf(request) }).andThen((status) => Result.combine(recorder
                .takeReadDatasets()
                .filter((dataset) => !dataset.startsWith(TERRITORY_DATASET_PREFIX))
                .map((dataset) => dataSource.provenance(dataset))).map((datasets) => ({
                ...leverEstimate,
                status,
                limits: LEVER_LIMITS[request.id],
                datasets,
            }))));
        });
    }
    function estimateLever(request) {
        return match(request)
            .with({ id: 'batiments_machines_agricoles' }, (batimentsMachinesAgricolesRequest) => estimateOnComputedLevel(batimentsMachinesAgricolesRequest, (computedLevelRequest) => estimateBatimentsMachinesAgricoles(computedLevelRequest, context)))
            .with({ id: 'dechets_mode_de_traitement' }, (dechetsModeDeTraitementRequest) => estimateOnComputedLevel(dechetsModeDeTraitementRequest, (computedLevelRequest) => estimateDechetsModeDeTraitement(computedLevelRequest, context)))
            .with({ id: 'dechets_sobriete' }, (dechetsSobrieteRequest) => estimateOnComputedLevel(dechetsSobrieteRequest, (computedLevelRequest) => estimateDechetsSobriete(computedLevelRequest, context)))
            .with({ id: 'elevage_durable' }, (elevageDurableRequest) => estimateOnComputedLevel(elevageDurableRequest, (computedLevelRequest) => estimateElevageDurable(computedLevelRequest, context)))
            .with({ id: 'fertilisation_azotee' }, (fertilisationAzoteeRequest) => estimateOnComputedLevel(fertilisationAzoteeRequest, (computedLevelRequest) => estimateFertilisationAzotee(computedLevelRequest, context)))
            .with({ id: 'haies' }, (haiesRequest) => ok(estimateHaies(haiesRequest)))
            .with({ id: 'occupation_des_sols' }, (occupationDesSolsRequest) => estimateOnComputedLevel(occupationDesSolsRequest, (computedLevelRequest) => estimateOccupationDesSols(computedLevelRequest, context)))
            .with({ id: 'pratiques_stockantes' }, (pratiquesStockantesRequest) => ok(estimatePratiquesStockantes(pratiquesStockantesRequest)))
            .with({ id: 'produits_bois' }, (produitsBoisRequest) => estimateOnComputedLevel(produitsBoisRequest, (computedLevelRequest) => estimateProduitsBois(computedLevelRequest, context)))
            .with({ id: 'reseaux_chaleur' }, (reseauxChaleurRequest) => estimateOnComputedLevel(reseauxChaleurRequest, (computedLevelRequest) => estimateReseauxChaleur(computedLevelRequest, context)))
            .with({ id: 'residentiel_changement_systeme_chauffage' }, (residentielChangementSystemeChauffageRequest) => estimateOnComputedLevel(residentielChangementSystemeChauffageRequest, (computedLevelRequest) => estimateResidentielChangementSystemeChauffage(computedLevelRequest, context)))
            .with({ id: 'residentiel_renovation' }, (residentielRenovationRequest) => estimateOnComputedLevel(residentielRenovationRequest, (computedLevelRequest) => estimateResidentielRenovation(computedLevelRequest, context)))
            .with({ id: 'residentiel_sobriete' }, (residentielSobrieteRequest) => estimateOnComputedLevel(residentielSobrieteRequest, (computedLevelRequest) => estimateResidentielSobriete(computedLevelRequest, context)))
            .with({ id: 'transport_marchandises_efficacite' }, (transportMarchandisesEfficaciteRequest) => estimateOnComputedLevel(transportMarchandisesEfficaciteRequest, (computedLevelRequest) => estimateTransportMarchandisesEfficacite(computedLevelRequest, context)))
            .with({ id: 'transport_marchandises_electrification' }, (transportMarchandisesElectrificationRequest) => estimateOnComputedLevel(transportMarchandisesElectrificationRequest, (computedLevelRequest) => estimateTransportMarchandisesElectrification(computedLevelRequest, context)))
            .with({ id: 'transport_marchandises_report_modal' }, (transportMarchandisesReportModalRequest) => estimateOnComputedLevel(transportMarchandisesReportModalRequest, (computedLevelRequest) => estimateTransportMarchandisesReportModal(computedLevelRequest, context)))
            .with({ id: 'transport_marchandises_sobriete_logistique' }, (transportMarchandisesSobrieteLogistiqueRequest) => estimateOnComputedLevel(transportMarchandisesSobrieteLogistiqueRequest, (computedLevelRequest) => estimateTransportMarchandisesSobrieteLogistique(computedLevelRequest, context)))
            .with({ id: 'transport_personnes_efficacite' }, (transportPersonnesEfficaciteRequest) => estimateOnComputedLevel(transportPersonnesEfficaciteRequest, (computedLevelRequest) => estimateTransportPersonnesEfficacite(computedLevelRequest, context)))
            .with({ id: 'transport_personnes_electrification' }, (transportPersonnesElectrificationRequest) => estimateOnComputedLevel(transportPersonnesElectrificationRequest, (computedLevelRequest) => estimateTransportPersonnesElectrification(computedLevelRequest, context)))
            .with({ id: 'transport_personnes_report_modal' }, (transportPersonnesReportModalRequest) => estimateOnComputedLevel(transportPersonnesReportModalRequest, (computedLevelRequest) => estimateTransportPersonnesReportModal(computedLevelRequest, context)))
            .with({ id: 'transport_personnes_sobriete_deplacements' }, (transportPersonnesSobrieteDeplacementsRequest) => estimateOnComputedLevel(transportPersonnesSobrieteDeplacementsRequest, (computedLevelRequest) => estimateTransportPersonnesSobrieteDeplacements(computedLevelRequest, context)))
            .exhaustive();
    }
    return estimate;
}
export { createEstimator };
//# sourceMappingURL=estimate.js.map