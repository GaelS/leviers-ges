// Source : fiche d'analyse 11 (sobriété des déplacements), calcul d'essai sur OMINEA v23.1 de mars 2026 (CO2 + 28 CH4 + 265 N2O, 50 % route et 50 % ville, normes Euro choisies par Crit'Air, parc métropolitain 2025) : diesel 163,6, essence 171,1, gaz (correspondance essence) 231,5 g/véh.km ; électrique : Base Empreinte, élément 28007, amont seul (voir assumptions.md, electricVehicleEmissionFactors), 13,345 g/véh.km
const CAR_EMISSION_FACTORS_KG_PER_KM = {
  diesel: '0.1636',
  essence: '0.1711',
  gaz: '0.2315',
  electrique: '0.013345',
} as const

// Source : OMINEA 2024 (CITEPA), bus et cars Euro VI, CO2 seul (aucun CH4 ni N2O pour ces lignes), moyenne de 070302BC (route) et 070303BC (ville) : diesel NAPFUE 205, 804,5 g/véh.km ; gaz NAPFUE 302, 709,8 g/véh.km ; électrique : Base Empreinte, bus électrique, amont seul (voir assumptions.md, electricVehicleEmissionFactors), 0,0095 kgCO2e/passager.km × 10 passagers. Choix de conception, non validé : la valeur basse de OMINEA (0,0805 kgCO2e/passager.km pour le diesel) est retenue contre 0,0874 pour Base Empreinte
const BUS_EMISSION_FACTORS_KG_PER_KM = {
  diesel: '0.8045',
  gaz: '0.7098',
  electrique: '0.095',
} as const

export { BUS_EMISSION_FACTORS_KG_PER_KM, CAR_EMISSION_FACTORS_KG_PER_KM }
