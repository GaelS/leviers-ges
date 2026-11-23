import type BigNumber from 'bignumber.js'
import { toBig } from '../../domain/big-number.ts'
import { quantity, type Fraction } from '../../domain/units.ts'

type HeatingVector = 'electricity' | 'naturalGas' | 'fuelOil' | 'wood' | 'heat'

type NationalUsage = {
  readonly heating: BigNumber
  readonly allUses: BigNumber
}

function toShare({ heating, allUses }: NationalUsage): Fraction {
  return quantity<'Fraction'>(heating.dividedBy(allUses).toFixed())
}

// Source : SDES, « Consommation énergétique du secteur résidentiel » (Conso_usage), 2024, à climat réel, TWh PCI : électricité de chauffage (hors PAC 34,459046350223204 + PAC 10,5510417675111)
// sur l'électricité tous usages (hors PAC 136,459186710296 + PAC 11,970049134701899). Choix de conception, non validé : la part nationale s'applique à chaque territoire
const ELECTRICITY_HEATING_SHARE: Fraction = toShare({
  heating: toBig('34.459046350223204').plus(toBig('10.5510417675111')),
  allUses: toBig('136.459186710296').plus(toBig('11.970049134701899')),
})

// Source : SDES, Conso_usage, 2024, TWh PCI : gaz naturel, chauffage 81,257758783685603 sur tous usages 101,76291646815. Choix de conception, non validé
const NATURAL_GAS_HEATING_SHARE: Fraction = toShare({
  heating: toBig('81.257758783685603'),
  allUses: toBig('101.76291646815'),
})

// Source : SDES, Conso_usage, 2024, TWh PCI : fioul domestique, chauffage 25,893030524875698 sur tous usages 29,209733424582701. Choix de conception, non validé
const FUEL_OIL_HEATING_SHARE: Fraction = toShare({
  heating: toBig('25.893030524875698'),
  allUses: toBig('29.209733424582701'),
})

// Source : SDES, Conso_usage, 2024, TWh PCI : chaleur, chauffage 13,401216880281 sur tous usages 14,709410399686901. Choix de conception, non validé
const HEAT_HEATING_SHARE: Fraction = toShare({
  heating: toBig('13.401216880281'),
  allUses: toBig('14.709410399686901'),
})

// Source : ADEME, « Rénovation performante par étapes » (2021), p. 156, rendements globaux des installations existantes : ancienne chaudière gaz 75 %, ancienne chaudière fioul 75 %,
// poêle à bois ancien 70 %, radiateur électrique existant 95 % ; chaleur livrée : 1 (Residentiel_ChgtSyst, « l'énergie livrée correspond à l'énergie utile »)
const CURRENT_EFFICIENCY: Readonly<Record<HeatingVector, Fraction>> = {
  electricity: quantity<'Fraction'>('0.95'),
  naturalGas: quantity<'Fraction'>('0.75'),
  fuelOil: quantity<'Fraction'>('0.75'),
  wood: quantity<'Fraction'>('0.70'),
  heat: quantity<'Fraction'>('1'),
}

// Source : ADEME, « Rénovation performante par étapes » (2021), p. 156, rendements des installations rénovées : chaudière gaz 90 %, chaudière fioul 90 %, radiateur électrique rénové 100 %,
// poêle à bois rénové 75 % (la plus basse des deux valeurs bois, 75 % et 85 %, choix de conception, non validé) ; chaleur livrée : 1
const TARGET_EFFICIENCY: Readonly<Record<HeatingVector, Fraction>> = {
  electricity: quantity<'Fraction'>('1'),
  naturalGas: quantity<'Fraction'>('0.9'),
  fuelOil: quantity<'Fraction'>('0.9'),
  wood: quantity<'Fraction'>('0.75'),
  heat: quantity<'Fraction'>('1'),
}

// Source : choix de conception de ce dépôt, sans source externe : les parts nationales du chauffage par vecteur, aucune par territoire (le CEREN n'est pas ouvert)
const HEATING_SHARE: Readonly<Record<Exclude<HeatingVector, 'wood'>, Fraction>> = {
  electricity: ELECTRICITY_HEATING_SHARE,
  naturalGas: NATURAL_GAS_HEATING_SHARE,
  fuelOil: FUEL_OIL_HEATING_SHARE,
  heat: HEAT_HEATING_SHARE,
}

export { CURRENT_EFFICIENCY, HEATING_SHARE, TARGET_EFFICIENCY }
export type { HeatingVector }
