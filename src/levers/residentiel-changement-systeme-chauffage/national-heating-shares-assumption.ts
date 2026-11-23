import type { AppliedAssumption } from '../../application/estimate/estimate-result.ts'

// Source : choix de conception de ce dépôt, sans source externe : valeurs, source et limite de la part nationale du chauffage, non validé
const NATIONAL_HEATING_SHARES_ASSUMPTION: AppliedAssumption = {
  value:
    'electricity 46.7%, natural gas 92.6%, fuel oil 100%, heat 100%, wood 0 (national shares of heating and hot water in residential consumption, 2024)',
  source:
    'SDES, Consommation énergétique du secteur résidentiel (Conso_usage), 2024, à climat réel, PCI; wood and LPG are not computed (documentation fonctionnelle PlanET, pp. 52-53; no efficiency for LPG in ADEME Rénovation performante par étapes, p. 156)',
  limit:
    'The CEREN heating and hot water energy by département is not open: every territory is assumed to use these energies in the same proportion as France. LPG consumption is left unchanged. Wood is absent from the territory data, so a wood target only takes energy from the other vectors.',
}

export { NATIONAL_HEATING_SHARES_ASSUMPTION }
