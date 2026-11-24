import { fileURLToPath } from 'node:url'
import type { Result } from 'neverthrow'
import type { EstimationError } from './application/estimate/estimation-error.ts'
import { createEstimator, type Estimate, type RequestInput } from './estimator/estimate.ts'
import { createCsvDataSource } from './infrastructure/csv/csv-data-source.ts'

// Source : choix de conception, non validé : les jeux de données sont livrés avec le paquet, dans data/ à sa racine (src/ et dist/ en sont tous deux d'un niveau)
const PACKAGE_DATA_DIRECTORY = fileURLToPath(new URL('../data', import.meta.url))

type EstimateUntrustedRequest = (request: unknown) => Result<Estimate, EstimationError>

// Un estimateur prêt à l'emploi, sur les données livrées avec le paquet. L'appelant n'a ni source de données ni type de requête à connaître : la requête entre comme inconnue et createEstimator la valide avant tout calcul.
function createDefaultEstimator(): EstimateUntrustedRequest {
  const estimate = createEstimator(createCsvDataSource(PACKAGE_DATA_DIRECTORY))
  // Source : choix de conception, non validé : seul endroit où la requête inconnue est typée, parseRequest la valide aussitôt
  return (request) => estimate(request as RequestInput)
}

export { createDefaultEstimator }
export type { EstimateUntrustedRequest }
