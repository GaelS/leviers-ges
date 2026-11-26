import type BigNumber from 'bignumber.js'
import { sum, toBig } from '../../domain/big-number.ts'
import {
  convertToKgPerKwh,
  ELECTRICITY_APPLIED_EMISSION_FACTOR,
  FUEL_OIL_EMISSION_FACTOR,
  LIQUEFIED_PETROLEUM_GAS_EMISSION_FACTOR,
  NATURAL_GAS_EMISSION_FACTOR,
} from '../../domain/emission-factors.ts'
import {
  HEATING_AND_HOT_WATER_SHARE,
  type ResidentialEnergyVector,
} from '../../domain/residential-heating-shares.ts'
import type { ResidentialConsumption } from '../../domain/residential-consumption.ts'
import { quantity } from '../../domain/units.ts'
import type { Fraction, KgCo2ePerKwh, TonnesCo2ePerYear } from '../../domain/units.ts'
import type { HousingSurface } from './data/housing-surface.ts'

// Source : documentation fonctionnelle PlanET (juin 2026), pp. 53-54 ; PlanET V1, Residentiel_Rénovation!B13 et A34 : une rénovation réduit de 35 % la consommation des maisons et des appartements construits avant 1971, exigence de l'ANAH
const RENOVATION_REDUCTION: Fraction = quantity<'Fraction'>('0.35')

// Source : documentation fonctionnelle PlanET (juin 2026), p. 54 : les logements collectifs construits après 1971 sont alignés sur les exigences BBC rénovation ; PlanET V1, Residentiel_Rénovation!B13 : moins de 110 kWhEP/m²/an
const BBC_PRIMARY_ENERGY_THRESHOLD: BigNumber = toBig('110')

// Source : PlanET V1, Residentiel_Rénovation!B13 : moins de 11 kgCO2eq/m²/an pour le BBC rénovation
const BBC_EMISSION_THRESHOLD: BigNumber = toBig('11')

// Source : arrêté du 13 août 2025 modifiant l'annexe 3 de l'arrêté du 31 mars 2021 relatif au DPE : coefficient de conversion de l'électricité en énergie primaire de 1,9 à compter du 1er janvier 2026 (2,3 avant), non donné par la documentation fonctionnelle ; non relu sur Légifrance, choix de conception, non validé
const ELECTRICITY_PRIMARY_ENERGY_FACTOR: BigNumber = toBig('1.9')

// Source : choix de conception, non validé : coefficient de conversion en énergie primaire des énergies autres que l'électricité (1), non donné par la documentation fonctionnelle
const OTHER_PRIMARY_ENERGY_FACTOR: BigNumber = toBig('1')

// Source : élément neutre de l'addition : aucune énergie évitée
const NO_AVOIDED_ENERGY: BigNumber = toBig('0')

// Source : le parc entier d'un vecteur vaut 100 % de ses surfaces : la part d'après 1971 est le complément de la part éligible
const WHOLE_SURFACE: BigNumber = toBig('1')

// Source : BIPM, Le Système international d'unités (Brochure SI), préfixes SI : 1 MWh = 1 000 kWh
const KILOWATT_HOURS_PER_MEGAWATT_HOUR: BigNumber = toBig('1000')

// Source : src/domain/residential-consumption.ts : les cinq vecteurs de consommation résidentielle, sans le bois absent des données du territoire
const VECTORS: readonly ResidentialEnergyVector[] = [
  'electricity',
  'naturalGas',
  'fuelOil',
  'liquefiedPetroleumGas',
  'heat',
]

function primaryEnergyFactorOf(vector: ResidentialEnergyVector): BigNumber {
  return vector === 'electricity' ? ELECTRICITY_PRIMARY_ENERGY_FACTOR : OTHER_PRIMARY_ENERGY_FACTOR
}

function bbcIntensityCap({
  vector,
  emissionFactor,
}: {
  vector: ResidentialEnergyVector
  emissionFactor: KgCo2ePerKwh
}): BigNumber {
  const primaryEnergyCap = BBC_PRIMARY_ENERGY_THRESHOLD.dividedBy(primaryEnergyFactorOf(vector))
  if (emissionFactor.isZero()) return primaryEnergyCap
  const emissionCap = BBC_EMISSION_THRESHOLD.dividedBy(emissionFactor)
  return primaryEnergyCap.isLessThan(emissionCap) ? primaryEnergyCap : emissionCap
}

function calculateBbcAvoidedEnergy({
  vector,
  heatingAndHotWater,
  surface,
  emissionFactor,
}: {
  vector: ResidentialEnergyVector
  heatingAndHotWater: BigNumber
  surface: HousingSurface
  emissionFactor: KgCo2ePerKwh
}): BigNumber {
  if (surface.total.isZero()) return NO_AVOIDED_ENERGY
  const energyInKwh = heatingAndHotWater.times(KILOWATT_HOURS_PER_MEGAWATT_HOUR)
  const intensity = energyInKwh.dividedBy(surface.total)
  const cap = bbcIntensityCap({ vector, emissionFactor })
  if (intensity.isLessThanOrEqualTo(cap)) return NO_AVOIDED_ENERGY
  const excessPerSquareMetre = intensity.minus(cap)
  const bbcShare = WHOLE_SURFACE.minus(surface.eligibleShare)
  const bbcSurface = surface.total.times(bbcShare)
  const excessEnergyInKwh = excessPerSquareMetre.times(bbcSurface)
  return excessEnergyInKwh.dividedBy(KILOWATT_HOURS_PER_MEGAWATT_HOUR)
}

function calculateResidentielRenovationReduction({
  renovatedParcFraction,
  consumption,
  housingSurfaces,
  heatEmissionFactor,
}: {
  renovatedParcFraction: Fraction
  consumption: ResidentialConsumption
  housingSurfaces: Readonly<Record<ResidentialEnergyVector, HousingSurface>>
  heatEmissionFactor: KgCo2ePerKwh
}): TonnesCo2ePerYear {
  const emissionFactors: Readonly<Record<ResidentialEnergyVector, KgCo2ePerKwh>> = {
    electricity: ELECTRICITY_APPLIED_EMISSION_FACTOR,
    naturalGas: convertToKgPerKwh(NATURAL_GAS_EMISSION_FACTOR),
    fuelOil: convertToKgPerKwh(FUEL_OIL_EMISSION_FACTOR),
    liquefiedPetroleumGas: convertToKgPerKwh(LIQUEFIED_PETROLEUM_GAS_EMISSION_FACTOR),
    heat: heatEmissionFactor,
  }
  const avoidedByVector = VECTORS.map((vector) => {
    const surface = housingSurfaces[vector]
    const heatingAndHotWater = consumption[vector].times(HEATING_AND_HOT_WATER_SHARE[vector])
    const eligibleEnergy = heatingAndHotWater.times(surface.eligibleShare)
    const standardAvoidedEnergy = eligibleEnergy.times(RENOVATION_REDUCTION)
    const bbcAvoidedEnergy = calculateBbcAvoidedEnergy({
      vector,
      heatingAndHotWater,
      surface,
      emissionFactor: emissionFactors[vector],
    })
    const avoidedEnergyOfParc = standardAvoidedEnergy.plus(bbcAvoidedEnergy)
    const renovatedAvoidedEnergy = avoidedEnergyOfParc.times(renovatedParcFraction)
    return renovatedAvoidedEnergy.times(emissionFactors[vector])
  })
  return quantity<'TonnesCo2ePerYear'>(sum(avoidedByVector).toFixed())
}

export { calculateResidentielRenovationReduction }
