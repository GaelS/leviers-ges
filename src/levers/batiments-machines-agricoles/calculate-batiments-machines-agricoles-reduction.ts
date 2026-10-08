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
import type { AgriculturalConsumption } from './agricultural-consumption.ts'

type ReductionFractions = {
  readonly electricity: Fraction
  readonly naturalGas: Fraction
  readonly petroleumProducts: Fraction
  readonly heat: Fraction
}

// Source : Base Empreinte, élément 15591 (électricité, mix moyen), version 23.11, validité décembre 2017,
// incertitude 10 % : 0,0791 kgCO2e/kWh. PlanET V1, onglet Bâtiment&MachinesAgricoles
const ELECTRICITY_EMISSION_FACTOR: KgCo2ePerKwh = quantity<'KgCo2ePerKwh'>('0.0791')

// Source : PlanET V1, onglet Bâtiment&MachinesAgricoles, forme « FE de l'électricité * 67,4% » ;
// aucune cellule du classeur ne contient ni n'explique ce coefficient, repris tel quel
const ELECTRICITY_EMISSION_FACTOR_SHARE: Fraction = quantity<'Fraction'>('0.674')

// Source : OMINEA, base BDD_OMINEA_A_EF, NAPFUE 301 (gaz naturel), SNAP 020302, 2024 :
// 55,88 kg CO2/GJ PCI. PlanET V1, DonneesReference
const NATURAL_GAS_EMISSION_FACTOR: KgCo2ePerGigajoule = quantity<'KgCo2ePerGigajoule'>('55.88')

// Source : OMINEA, base BDD_OMINEA_A_EF, NAPFUE 203 (fioul lourd), SNAP 020302, valeur constante de 2013 à 2024 :
// 78 kg CO2/GJ. PlanET V1, forme « FE du fioul lourd » (intitulé de « autres produits pétroliers »)
const PETROLEUM_PRODUCTS_EMISSION_FACTOR: KgCo2ePerGigajoule = quantity<'KgCo2ePerGigajoule'>('78')

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

function calculateAvoidedEmissions({
  consumption,
  reductionFraction,
  emissionFactor,
}: {
  consumption: MegawattHours
  reductionFraction: Fraction
  emissionFactor: KgCo2ePerKwh
}): BigNumber {
  const reducedConsumption = consumption.times(reductionFraction)
  return reducedConsumption.times(emissionFactor)
}

function calculateBatimentsMachinesAgricolesReduction({
  reductionFractions,
  consumption,
  heatEmissionFactor,
}: {
  reductionFractions: ReductionFractions
  consumption: AgriculturalConsumption
  heatEmissionFactor: KgCo2ePerKwh
}): TonnesCo2ePerYear {
  const electricityEmissionFactor = calculateElectricityEmissionFactor()
  const electricityAvoidedEmissions = calculateAvoidedEmissions({
    consumption: consumption.electricity,
    reductionFraction: reductionFractions.electricity,
    emissionFactor: electricityEmissionFactor,
  })
  const naturalGasAvoidedEmissions = calculateAvoidedEmissions({
    consumption: consumption.naturalGas,
    reductionFraction: reductionFractions.naturalGas,
    emissionFactor: convertToKgPerKwh(NATURAL_GAS_EMISSION_FACTOR),
  })
  const petroleumProductsAvoidedEmissions = calculateAvoidedEmissions({
    consumption: consumption.petroleumProducts,
    reductionFraction: reductionFractions.petroleumProducts,
    emissionFactor: convertToKgPerKwh(PETROLEUM_PRODUCTS_EMISSION_FACTOR),
  })
  const heatAvoidedEmissions = calculateAvoidedEmissions({
    consumption: consumption.heat,
    reductionFraction: reductionFractions.heat,
    emissionFactor: heatEmissionFactor,
  })
  const avoidedEmissionsByVector = [
    electricityAvoidedEmissions,
    naturalGasAvoidedEmissions,
    petroleumProductsAvoidedEmissions,
    heatAvoidedEmissions,
  ]
  const totalAvoidedEmissions = sum(avoidedEmissionsByVector)
  return quantity<'TonnesCo2ePerYear'>(totalAvoidedEmissions.toFixed())
}

export { calculateBatimentsMachinesAgricolesReduction }
export type { ReductionFractions }
