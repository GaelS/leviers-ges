type CerenFuelConsumption = {
  readonly fuelOilTwh: string
  readonly liquefiedPetroleumGasTwh: string
}

// Source : choix de conception, non validé : nom du jeu cité dans les erreurs de répartition du fioul et du GPL ; le classeur du CEREN n'est plus versionné
const cerenDataset = 'residentiel-sobriete/ceren-national-fuel-consumption'

// Source : CEREN, Données sur l'énergie dans le résidentiel en France métropolitaine, mise à jour du 20 décembre 2024, tableau « Répartition en 2024 des consommations des résidences principales par usage », ligne « Total Fioul » et ligne « Total GPL », année 2024, en TWh à climat normal. Seules ces deux valeurs sont reprises : le classeur n'est pas redistribué, le CEREN ne publiant pas de licence de réutilisation (voir data/LICENSES.md)
const CEREN_NATIONAL_FUEL_CONSUMPTION_2024: CerenFuelConsumption = {
  fuelOilTwh: '32',
  liquefiedPetroleumGasTwh: '8',
}

export { CEREN_NATIONAL_FUEL_CONSUMPTION_2024, cerenDataset }
export type { CerenFuelConsumption }
