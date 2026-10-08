import type BigNumber from 'bignumber.js'
import { sum, toBig } from '../../domain/big-number.ts'
import { quantity } from '../../domain/units.ts'
import type {
  Fraction,
  KgCo2ePerGigajoule,
  KgCo2ePerKwh,
  MegawattHours,
  TonnesCo2ePerYear,
} from '../../domain/units.ts'
import type { ResidentialConsumption } from './data/residential-consumption.ts'

type SobrietyFractions = {
  readonly households: Fraction
  readonly consumptionReduction: Fraction
}

// Source : Base Empreinte, élément 15591 (électricité, mix moyen), version 23.11, validité décembre 2017,
// incertitude 10 % : 0,0791 kgCO2e/kWh. PlanET V1, onglet Residentiel_Sobriete
const ELECTRICITY_EMISSION_FACTOR: KgCo2ePerKwh = quantity<'KgCo2ePerKwh'>('0.0791')

// Source : PlanET V1, onglet Residentiel_Sobriete, forme « FE électricité * 67,4% » ;
// aucune cellule du classeur ne contient ni n'explique ce coefficient, repris tel quel
const ELECTRICITY_EMISSION_FACTOR_SHARE: Fraction = quantity<'Fraction'>('0.674')

// Source : OMINEA, base BDD_OMINEA_A_EF, NAPFUE 301 (gaz naturel), SNAP 020202 (chauffage résidentiel), 2024 :
// 55,8796 kg CO2/GJ PCI, arrondi à 55,88 comme dans la fiche d'analyse du levier
const NATURAL_GAS_EMISSION_FACTOR: KgCo2ePerGigajoule = quantity<'KgCo2ePerGigajoule'>('55.88')

// Source : OMINEA, base BDD_OMINEA_A_EF, NAPFUE 204 (fioul domestique), SNAP 020202 (chauffage résidentiel), 2024 :
// 74,5229 kg CO2/GJ PCI, arrondi à 74,52 comme dans la fiche d'analyse du levier
const FUEL_OIL_EMISSION_FACTOR: KgCo2ePerGigajoule = quantity<'KgCo2ePerGigajoule'>('74.52')

// Source : OMINEA, base BDD_OMINEA_A_EF, NAPFUE 303 (GPL), SNAP 020202 (chauffage résidentiel), 2024 :
// 63,1 kg CO2/GJ PCI
const LIQUEFIED_PETROLEUM_GAS_EMISSION_FACTOR: KgCo2ePerGigajoule =
  quantity<'KgCo2ePerGigajoule'>('63.1')

// Source : PlanET V1, DonneesReference!D16 « convertir GJ en kWh » : 1 kWh = 3,6 MJ = 0,0036 GJ
const GIGAJOULES_PER_KILOWATT_HOUR: BigNumber = toBig('0.0036')

function convertToKgPerKwh(emissionFactor: KgCo2ePerGigajoule): KgCo2ePerKwh {
  return quantity<'KgCo2ePerKwh'>(emissionFactor.times(GIGAJOULES_PER_KILOWATT_HOUR).toFixed())
}

function calculateElectricityEmissionFactor(): KgCo2ePerKwh {
  return quantity<'KgCo2ePerKwh'>(
    ELECTRICITY_EMISSION_FACTOR.times(ELECTRICITY_EMISSION_FACTOR_SHARE).toFixed(),
  )
}

function calculateEmissions({
  consumption,
  emissionFactor,
}: {
  consumption: MegawattHours
  emissionFactor: KgCo2ePerKwh
}): BigNumber {
  return consumption.times(emissionFactor)
}

function calculateResidentielSobrieteReduction({
  sobrietyFractions,
  consumption,
  heatEmissionFactor,
}: {
  sobrietyFractions: SobrietyFractions
  consumption: ResidentialConsumption
  heatEmissionFactor: KgCo2ePerKwh
}): TonnesCo2ePerYear {
  const electricityEmissions = calculateEmissions({
    consumption: consumption.electricity,
    emissionFactor: calculateElectricityEmissionFactor(),
  })
  const naturalGasEmissions = calculateEmissions({
    consumption: consumption.naturalGas,
    emissionFactor: convertToKgPerKwh(NATURAL_GAS_EMISSION_FACTOR),
  })
  const fuelOilEmissions = calculateEmissions({
    consumption: consumption.fuelOil,
    emissionFactor: convertToKgPerKwh(FUEL_OIL_EMISSION_FACTOR),
  })
  const liquefiedPetroleumGasEmissions = calculateEmissions({
    consumption: consumption.liquefiedPetroleumGas,
    emissionFactor: convertToKgPerKwh(LIQUEFIED_PETROLEUM_GAS_EMISSION_FACTOR),
  })
  const heatEmissions = calculateEmissions({
    consumption: consumption.heat,
    emissionFactor: heatEmissionFactor,
  })
  const emissionsByVector = [
    electricityEmissions,
    naturalGasEmissions,
    fuelOilEmissions,
    liquefiedPetroleumGasEmissions,
    heatEmissions,
  ]
  const totalEmissions = sum(emissionsByVector)
  const reductionShare = sobrietyFractions.households.times(sobrietyFractions.consumptionReduction)
  const avoidedEmissions = totalEmissions.times(reductionShare)
  return quantity<'TonnesCo2ePerYear'>(avoidedEmissions.toFixed())
}

export { calculateResidentielSobrieteReduction }
export type { SobrietyFractions }
