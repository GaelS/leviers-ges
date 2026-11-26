import type { AppliedAssumptions } from '../../application/estimate/estimate-result.ts'

function toAppliedAssumptions(): AppliedAssumptions {
  return {
    nationalHeatingShares: {
      value:
        'énergie du chauffage et de l’eau chaude = consommation du territoire × part nationale (électricité 46,7 %, gaz naturel 92,6 %, fioul 100 %, GPL 53,2 %, chaleur 100 %, 2024) ; la même consommation par mètre carré pour tous les logements utilisant une énergie donnée',
      source:
        'Documentation fonctionnelle (p. 51) : le chauffage et l’eau chaude sont les consommations du levier de rénovation ; SDES, Consommation énergétique du secteur résidentiel (Conso_usage), 2024',
      limit:
        'La consommation CEREN par mètre carré selon le type, l’énergie, la période et le département n’est pas ouverte : chaque territoire est supposé consommer comme la France, et les maisons comme les appartements, les logements anciens comme récents. Le bois est absent des données du territoire',
    },
    flatsAfter1971BbcLevel: {
      value:
        'les logements collectifs construits après 1971 rejoignent le niveau BBC rénovation : au plus 110 kWh d’énergie primaire et 11 kgCO2e par m² et par an, la consommation actuelle par m² étant celle du territoire pour l’énergie considérée',
      source:
        'Documentation fonctionnelle (p. 54) : les logements collectifs construits après 1971 sont alignés sur les exigences BBC rénovation ; PlanET V1, Residentiel_Rénovation!B13 : moins de 110 kWhEP/m²/an et moins de 11 kgCO2e/m²/an ; réduction de 35 % pour les autres logements. Énergie primaire : coefficient du DPE, 1,9 pour l’électricité (depuis le 1er janvier 2026, 2,3 avant) et 1 pour les autres énergies (choix de conception, non validé)',
      limit:
        'La documentation ne donne ni la formule ni les coefficients d’énergie primaire ; la consommation par m² est la moyenne du territoire pour l’énergie, la même pour les logements récents et anciens ; le plafond d’émissions de 11 kgCO2e/m² est évalué avec les facteurs d’émission de la documentation, non ceux du DPE (gaz 0,227, fioul 0,324, GPL 0,272 : +1,8 % sur le total)',
    },
  }
}

export { toAppliedAssumptions }
