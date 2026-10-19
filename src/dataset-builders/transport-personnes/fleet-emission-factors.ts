// Source : fiche d'analyse 11, calcul d'essai sur OMINEA v23.1 de mars 2026 (CO2 + 28 CH4 + 265 N2O, 50 % route et 50 % ville, normes Euro choisies par Crit'Air, parc métropolitain 2025) : diesel, 163,6 g/véh.km
const CAR_DIESEL_EMISSION_FACTOR = '0.1636'

// Source : fiche d'analyse 11, même calcul d'essai sur OMINEA v23.1 : essence, 171,1 g/véh.km
const CAR_PETROL_EMISSION_FACTOR = '0.1711'

// Source : fiche d'analyse 11, même calcul d'essai sur OMINEA v23.1 : gaz, par correspondance avec l'essence (choix de conception, non validé : le gaz dépasse l'essence), 231,5 g/véh.km
const CAR_GAS_EMISSION_FACTOR = '0.2315'

// Source : Base Empreinte, élément 28007, voiture électrique compacte, amont seul, 13,345 g/véh.km (assumptions.md, electricVehicleEmissionFactors)
const CAR_ELECTRIC_EMISSION_FACTOR = '0.013345'

// Source : OMINEA 2024 (CITEPA), bus et cars Euro VI, NAPFUE 205, CO2 seul, moyenne de 070302BC (route) et 070303BC (ville), 804,5 g/véh.km. Choix de conception, non validé : la valeur basse est retenue, Base Empreinte donne 0,0874 kgCO2e/passager.km contre 0,0805 ici avec 10 passagers
const BUS_DIESEL_EMISSION_FACTOR = '0.8045'

// Source : OMINEA 2024 (CITEPA), bus et cars Euro VI, NAPFUE 302, CO2 seul, moyenne de 070302BC (route) et 070303BC (ville), 709,8 g/véh.km
const BUS_GAS_EMISSION_FACTOR = '0.7098'

// Source : Base Empreinte, bus électrique, amont seul, 0,0095 kgCO2e/passager.km × 10 passagers par bus (assumptions.md, electricVehicleEmissionFactors)
const BUS_ELECTRIC_EMISSION_FACTOR = '0.095'

// Source : les quatre carburants de la fiche d'analyse 11 pour les voitures ; le carburant autre n'a pas de facteur et est exclu de la moyenne
const CAR_EMISSION_FACTORS_KG_PER_KM = {
  diesel: CAR_DIESEL_EMISSION_FACTOR,
  essence: CAR_PETROL_EMISSION_FACTOR,
  gaz: CAR_GAS_EMISSION_FACTOR,
  electrique: CAR_ELECTRIC_EMISSION_FACTOR,
}

// Source : les trois carburants des bus et cars qui ont un facteur ; l'essence (aucune ligne OMINEA) et le carburant autre sont exclus de la moyenne
const BUS_EMISSION_FACTORS_KG_PER_KM = {
  diesel: BUS_DIESEL_EMISSION_FACTOR,
  gaz: BUS_GAS_EMISSION_FACTOR,
  electrique: BUS_ELECTRIC_EMISSION_FACTOR,
}

export { BUS_EMISSION_FACTORS_KG_PER_KM, CAR_EMISSION_FACTORS_KG_PER_KM }
