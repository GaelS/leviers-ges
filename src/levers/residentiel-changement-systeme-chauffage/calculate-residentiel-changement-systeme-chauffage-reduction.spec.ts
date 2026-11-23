import { describe, expect, it } from 'vitest'
import type { ResidentialConsumption } from '../../domain/residential-consumption.ts'
import { quantity } from '../../domain/units.ts'
import {
  calculateResidentielChangementSystemeChauffageReduction,
  type TargetShares,
} from './calculate-residentiel-changement-systeme-chauffage-reduction.ts'

type VectorsInMwh = Partial<Record<keyof ResidentialConsumption, string>>

type SharesInput = Readonly<Record<keyof TargetShares, string>>

function consumptionOf({
  electricity = '0',
  naturalGas = '0',
  fuelOil = '0',
  liquefiedPetroleumGas = '0',
  heat = '0',
}: VectorsInMwh): ResidentialConsumption {
  return {
    electricity: quantity<'MegawattHours'>(electricity),
    naturalGas: quantity<'MegawattHours'>(naturalGas),
    fuelOil: quantity<'MegawattHours'>(fuelOil),
    liquefiedPetroleumGas: quantity<'MegawattHours'>(liquefiedPetroleumGas),
    heat: quantity<'MegawattHours'>(heat),
  }
}

function sharesOf(input: SharesInput): TargetShares {
  return {
    electricity: quantity<'Fraction'>(input.electricity),
    naturalGas: quantity<'Fraction'>(input.naturalGas),
    fuelOil: quantity<'Fraction'>(input.fuelOil),
    wood: quantity<'Fraction'>(input.wood),
    heat: quantity<'Fraction'>(input.heat),
  }
}

function reduction({
  vectors,
  shares,
  heatEmissionFactor = '0',
}: {
  vectors: VectorsInMwh
  shares: SharesInput
  heatEmissionFactor?: string
}): string {
  return calculateResidentielChangementSystemeChauffageReduction({
    targetShares: sharesOf(shares),
    consumption: consumptionOf(vectors),
    heatEmissionFactor: quantity<'KgCo2ePerKwh'>(heatEmissionFactor),
  })
    .decimalPlaces(2)
    .toFixed()
}

const ALL_TO_GAS: SharesInput = { electricity: '0', naturalGas: '1', fuelOil: '0', wood: '0', heat: '0' }
const ALL_TO_ELECTRICITY: SharesInput = { electricity: '1', naturalGas: '0', fuelOil: '0', wood: '0', heat: '0' }
const ALL_TO_WOOD: SharesInput = { electricity: '0', naturalGas: '0', fuelOil: '0', wood: '1', heat: '0' }
const MIXED_TARGET: SharesInput = { electricity: '0.4', naturalGas: '0.1', fuelOil: '0.1', wood: '0.1', heat: '0.3' }
const BALANCED_TARGET: SharesInput = { electricity: '0.3', naturalGas: '0.3', fuelOil: '0.2', wood: '0', heat: '0.2' }

describe('calculateResidentielChangementSystemeChauffageReduction', () => {
  it.each([
    ['1 000 MWh de fioul passent au gaz', ALL_TO_GAS, '89.21'],
    ['1 000 MWh de fioul passent à l’électricité', ALL_TO_ELECTRICITY, '214.55'],
    ['1 000 MWh de fioul passent au bois, facteur nul', ALL_TO_WOOD, '237.81'],
  ])('%s', (_label, shares, expected) => {
    expect(reduction({ vectors: { fuelOil: '1000' }, shares })).toBe(expected)
  })

  it.each([
    ['une cible mélangée', MIXED_TARGET, '263.35'],
    ['une cible équilibrée', BALANCED_TARGET, '113.08'],
  ])('1 000 MWh de chaque vecteur, chaleur à 0,1 kgCO2e/kWh, %s', (_label, shares, expected) => {
    const vectors = { electricity: '1000', naturalGas: '1000', fuelOil: '1000', heat: '1000' }
    expect(reduction({ vectors, shares, heatEmissionFactor: '0.1' })).toBe(expected)
  })

  it('une cible égale au mix actuel évite le gain de rendement des appareils rénovés', () => {
    const vectors = { naturalGas: '1000' }
    const keepGas: SharesInput = { electricity: '0', naturalGas: '1', fuelOil: '0', wood: '0', heat: '0' }
    expect(reduction({ vectors, shares: keepGas })).toBe('26.77')
  })

  it('une cible plus émettrice que l’actuel donne une réduction négative', () => {
    const allToFuelOil: SharesInput = { electricity: '0', naturalGas: '0', fuelOil: '1', wood: '0', heat: '0' }
    expect(reduction({ vectors: { naturalGas: '1000' }, shares: allToFuelOil })).toBe('-17.88')
  })

  it('un passage au réseau de chaleur sans réseau n’émet rien : facteur nul', () => {
    const allToHeat: SharesInput = { electricity: '0', naturalGas: '0', fuelOil: '0', wood: '0', heat: '1' }
    expect(reduction({ vectors: { fuelOil: '1000' }, shares: allToHeat })).toBe('237.81')
  })

  it('ne touche pas au GPL : sa consommation ne change pas le résultat', () => {
    const withoutLpg = reduction({ vectors: { fuelOil: '1000' }, shares: ALL_TO_GAS })
    const withLpg = reduction({
      vectors: { fuelOil: '1000', liquefiedPetroleumGas: '5000' },
      shares: ALL_TO_GAS,
    })
    expect(withLpg).toBe(withoutLpg)
  })

  it('évite 0 tCO2e avec du seul GPL, qui n’a pas de rendement', () => {
    expect(reduction({ vectors: { liquefiedPetroleumGas: '1000' }, shares: ALL_TO_GAS })).toBe('0')
  })

  it('évite 0 tCO2e sans énergie de chauffage plutôt que de diviser par zéro', () => {
    expect(reduction({ vectors: {}, shares: ALL_TO_ELECTRICITY })).toBe('0')
  })
})
