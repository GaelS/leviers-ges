import type BigNumber from 'bignumber.js'
import { toBig } from './big-number.ts'
import { quantity, type Fraction } from './units.ts'

type ResidentialEnergyVector = 'electricity' | 'naturalGas' | 'fuelOil' | 'liquefiedPetroleumGas' | 'heat'

type NationalUsage = {
  readonly heatingAndHotWater: BigNumber
  readonly allUses: BigNumber
}

function toShare({ heatingAndHotWater, allUses }: NationalUsage): Fraction {
  return quantity<'Fraction'>(heatingAndHotWater.dividedBy(allUses).toFixed())
}

// Source : documentation fonctionnelle PlanET (juin 2026), p. 51 : les consommations impactées par les leviers Rénovation et Changement de système de chauffage sont celles du chauffage et de l'eau chaude sanitaire, données CEREN ; CEREN, « Données sur l'énergie dans le résidentiel » (mise à jour du 20 décembre 2024), tableau « Répartition en 2024 des consommations », France métropolitaine, à climat normal, TWh entiers :
// électricité, chauffage 45 et ECS 16 sur un total de 148. Choix de conception, non validé : la part nationale s'applique à chaque territoire
const ELECTRICITY_HEATING_AND_HOT_WATER_SHARE: Fraction = toShare({
  heatingAndHotWater: toBig('45').plus(toBig('16')),
  allUses: toBig('148'),
})

// Source : documentation fonctionnelle PlanET (juin 2026), p. 51 ; CEREN, tableau « Répartition en 2024 des consommations », climat normal, TWh : gaz de ville, chauffage 80 et ECS 7 sur un total de 99 (cuisson 12). Choix de conception, non validé
const NATURAL_GAS_HEATING_AND_HOT_WATER_SHARE: Fraction = toShare({
  heatingAndHotWater: toBig('80').plus(toBig('7')),
  allUses: toBig('99'),
})

// Source : documentation fonctionnelle PlanET (juin 2026), p. 51 ; CEREN, tableau « Répartition en 2024 des consommations », climat normal, TWh : fioul, chauffage 29 et ECS 3 sur un total de 32. Choix de conception, non validé
const FUEL_OIL_HEATING_AND_HOT_WATER_SHARE: Fraction = toShare({
  heatingAndHotWater: toBig('29').plus(toBig('3')),
  allUses: toBig('32'),
})

// Source : documentation fonctionnelle PlanET (juin 2026), p. 51 ; CEREN, tableau « Répartition en 2024 des consommations », climat normal, TWh : chaleur urbaine, chauffage 13 et ECS 1 sur un total de 14. Choix de conception, non validé
const HEAT_HEATING_AND_HOT_WATER_SHARE: Fraction = toShare({
  heatingAndHotWater: toBig('13').plus(toBig('1')),
  allUses: toBig('14'),
})

// Source : documentation fonctionnelle PlanET (juin 2026), p. 51 ; CEREN, tableau « Répartition en 2024 des consommations », climat normal, TWh : GPL, chauffage 4 et ECS 0 (arrondi) sur un total de 8 (cuisson 3). Choix de conception, non validé
const LIQUEFIED_PETROLEUM_GAS_HEATING_AND_HOT_WATER_SHARE: Fraction = toShare({
  heatingAndHotWater: toBig('4').plus(toBig('0')),
  allUses: toBig('8'),
})

// Source : CEREN, parts nationales du chauffage et de l'ECS par vecteur, aucune par territoire (le CEREN départemental n'est pas ouvert) ; choix de conception, non validé : la part nationale s'applique à chaque territoire
const HEATING_AND_HOT_WATER_SHARE: Readonly<Record<ResidentialEnergyVector, Fraction>> = {
  electricity: ELECTRICITY_HEATING_AND_HOT_WATER_SHARE,
  naturalGas: NATURAL_GAS_HEATING_AND_HOT_WATER_SHARE,
  fuelOil: FUEL_OIL_HEATING_AND_HOT_WATER_SHARE,
  liquefiedPetroleumGas: LIQUEFIED_PETROLEUM_GAS_HEATING_AND_HOT_WATER_SHARE,
  heat: HEAT_HEATING_AND_HOT_WATER_SHARE,
}

export { HEATING_AND_HOT_WATER_SHARE }
export type { ResidentialEnergyVector }
