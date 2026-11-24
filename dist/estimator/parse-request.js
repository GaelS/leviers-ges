import { err, ok } from 'neverthrow';
import { z } from 'zod';
import { invalidRequest } from "../application/estimate/estimation-error.js";
import { batimentsMachinesAgricolesRequestSchema } from "../levers/batiments-machines-agricoles/index.js";
import { dechetsModeDeTraitementRequestSchema } from "../levers/dechets-mode-de-traitement/index.js";
import { dechetsSobrieteRequestSchema } from "../levers/dechets-sobriete/index.js";
import { elevageDurableRequestSchema } from "../levers/elevage-durable/index.js";
import { fertilisationAzoteeRequestSchema } from "../levers/fertilisation-azotee/index.js";
import { haiesRequestSchema } from "../levers/haies/index.js";
import { occupationDesSolsRequestSchema } from "../levers/occupation-des-sols/index.js";
import { pratiquesStockantesRequestSchema } from "../levers/pratiques-stockantes/index.js";
import { produitsBoisRequestSchema } from "../levers/produits-bois/index.js";
import { reseauxChaleurRequestSchema } from "../levers/reseaux-chaleur/index.js";
import { residentielChangementSystemeChauffageRequestSchema } from "../levers/residentiel-changement-systeme-chauffage/index.js";
import { residentielRenovationRequestSchema } from "../levers/residentiel-renovation/index.js";
import { residentielSobrieteRequestSchema } from "../levers/residentiel-sobriete/index.js";
import { transportMarchandisesElectrificationRequestSchema } from "../levers/transport-marchandises-electrification/index.js";
import { transportMarchandisesEfficaciteRequestSchema } from "../levers/transport-marchandises-efficacite/index.js";
import { transportMarchandisesReportModalRequestSchema } from "../levers/transport-marchandises-report-modal/index.js";
import { transportMarchandisesSobrieteLogistiqueRequestSchema } from "../levers/transport-marchandises-sobriete-logistique/index.js";
import { transportPersonnesElectrificationRequestSchema } from "../levers/transport-personnes-electrification/index.js";
import { transportPersonnesReportModalRequestSchema } from "../levers/transport-personnes-report-modal/index.js";
import { transportPersonnesSobrieteDeplacementsRequestSchema } from "../levers/transport-personnes-sobriete-deplacements/index.js";
import { transportPersonnesEfficaciteRequestSchema } from "../levers/transport-personnes-efficacite/index.js";
const requestSchema = z.discriminatedUnion('id', [
    batimentsMachinesAgricolesRequestSchema,
    dechetsModeDeTraitementRequestSchema,
    dechetsSobrieteRequestSchema,
    elevageDurableRequestSchema,
    fertilisationAzoteeRequestSchema,
    haiesRequestSchema,
    occupationDesSolsRequestSchema,
    pratiquesStockantesRequestSchema,
    produitsBoisRequestSchema,
    reseauxChaleurRequestSchema,
    residentielChangementSystemeChauffageRequestSchema,
    residentielRenovationRequestSchema,
    residentielSobrieteRequestSchema,
    transportMarchandisesEfficaciteRequestSchema,
    transportMarchandisesElectrificationRequestSchema,
    transportMarchandisesReportModalRequestSchema,
    transportMarchandisesSobrieteLogistiqueRequestSchema,
    transportPersonnesEfficaciteRequestSchema,
    transportPersonnesElectrificationRequestSchema,
    transportPersonnesReportModalRequestSchema,
    transportPersonnesSobrieteDeplacementsRequestSchema,
]);
function parameterOf(issue) {
    const unrecognizedKeys = issue.code === 'unrecognized_keys' ? issue.keys : [];
    const parameter = [...issue.path.map(String), ...unrecognizedKeys].join('.');
    return parameter === '' ? 'request' : parameter;
}
function messageOf(issue) {
    if (issue.code === 'invalid_type' && issue.path.length === 0)
        return 'expected an object';
    if (issue.code === 'invalid_union' && issue.path.join('.') === 'id')
        return 'unknown lever';
    return issue.message;
}
function parseRequest(input) {
    const parsed = requestSchema.safeParse(input);
    if (parsed.success)
        return ok(parsed.data);
    return err(invalidRequest(parsed.error.issues.map((issue) => ({ parameter: parameterOf(issue), message: messageOf(issue) }))));
}
export { parseRequest, requestSchema };
//# sourceMappingURL=parse-request.js.map