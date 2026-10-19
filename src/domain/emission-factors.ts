import type BigNumber from 'bignumber.js'
import { toBig } from './big-number.ts'
import { quantity } from './units.ts'
import type {
  Fraction,
  KgCo2ePerGigajoule,
  KgCo2ePerKwh,
  KgCo2ePerVehicleKilometre,
} from './units.ts'

// Source : Base Empreinte, élément 15591 (électricité, mix moyen), version 23.11, validité décembre 2017,
// incertitude 10 % : 0,0791 kgCO2e/kWh. PlanET V1, onglets Bâtiment&MachinesAgricoles et Residentiel_Sobriete
const ELECTRICITY_EMISSION_FACTOR: KgCo2ePerKwh = quantity<'KgCo2ePerKwh'>('0.0791')

// Source : PlanET V1, onglets Bâtiment&MachinesAgricoles et Residentiel_Sobriete, forme « FE de l'électricité * 67,4% » ;
// aucune cellule du classeur ne contient ni n'explique ce coefficient, repris tel quel
const ELECTRICITY_EMISSION_FACTOR_SHARE: Fraction = quantity<'Fraction'>('0.674')

// Source : produit des deux constantes précédentes : 0,0791 × 67,4 % = 0,0533134 kgCO2e/kWh
const ELECTRICITY_APPLIED_EMISSION_FACTOR: KgCo2ePerKwh = quantity<'KgCo2ePerKwh'>(
  ELECTRICITY_EMISSION_FACTOR.times(ELECTRICITY_EMISSION_FACTOR_SHARE).toFixed(),
)

// Source : OMINEA, base BDD_OMINEA_A_EF, NAPFUE 301 (gaz naturel), 2024 : 55,88 kg CO2/GJ PCI (SNAP 020302, agriculture).
// Pour le résidentiel (SNAP 020202) OMINEA donne 55,8796, arrondi à 55,88 (choix de conception, non validé). PlanET V1, DonneesReference
const NATURAL_GAS_EMISSION_FACTOR: KgCo2ePerGigajoule = quantity<'KgCo2ePerGigajoule'>('55.88')

// Source : PlanET V1, DonneesReference!D16 « convertir GJ en kWh » : 1 kWh = 3,6 MJ = 0,0036 GJ
const GIGAJOULES_PER_KILOWATT_HOUR: BigNumber = toBig('0.0036')

// Source : Base Empreinte, élément 28007, voiture électrique compacte, amont seul, 13,345 g/véh.km (assumptions.md, electricVehicleEmissionFactors)
const ELECTRIC_CAR_EMISSION_FACTOR: KgCo2ePerVehicleKilometre =
  quantity<'KgCo2ePerVehicleKilometre'>('0.013345')

// Source : Base Empreinte, bus électrique, amont seul, 0,0095 kgCO2e/passager.km × 10 passagers par bus (assumptions.md, electricVehicleEmissionFactors)
const ELECTRIC_BUS_EMISSION_FACTOR: KgCo2ePerVehicleKilometre =
  quantity<'KgCo2ePerVehicleKilometre'>('0.095')

function convertToKgPerKwh(emissionFactor: KgCo2ePerGigajoule): KgCo2ePerKwh {
  return quantity<'KgCo2ePerKwh'>(emissionFactor.times(GIGAJOULES_PER_KILOWATT_HOUR).toFixed())
}

export {
  convertToKgPerKwh,
  ELECTRIC_BUS_EMISSION_FACTOR,
  ELECTRIC_CAR_EMISSION_FACTOR,
  ELECTRICITY_APPLIED_EMISSION_FACTOR,
  NATURAL_GAS_EMISSION_FACTOR,
}
