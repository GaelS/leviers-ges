import type { AppliedAssumption } from '../../application/estimate/estimate-result.ts'

// Source : choix de conception de ce dépôt, sans source externe : valeurs, source et limite de la part nationale du chauffage, non validé
const NATIONAL_HEATING_SHARES_ASSUMPTION: AppliedAssumption = {
  value:
    'electricity 30.3%, natural gas 79.9%, fuel oil 88.6%, heat 91.1%, wood 0 (national shares of heating in residential consumption, 2024)',
  source:
    'SDES, Consommation énergétique du secteur résidentiel (Conso_usage), 2024, à climat réel, PCI; wood and LPG are not computed (documentation fonctionnelle PlanET, pp. 52-53; no efficiency for LPG in ADEME Rénovation performante par étapes, p. 156)',
  limit:
    'The CEREN heating energy by département is not open: every territory is assumed to heat in the same proportion as France. LPG consumption is left unchanged. Wood is absent from the territory data, so a wood target only takes energy from the other vectors.',
}

export { NATIONAL_HEATING_SHARES_ASSUMPTION }
