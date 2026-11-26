import { describe, expect, it } from 'vitest'
import type { ResidentialConsumption } from '../../domain/residential-consumption.ts'
import type { ResidentialEnergyVector } from '../../domain/residential-heating-shares.ts'
import { quantity } from '../../domain/units.ts'
import { calculateResidentielRenovationReduction } from './calculate-residentiel-renovation-reduction.ts'
import type { HousingSurface } from './data/housing-surface.ts'

type VectorsInMwh = Partial<Record<keyof ResidentialConsumption, string>>

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

const LARGE_SURFACE = '1000000000'

function surfacesOf({
  shares,
  total,
}: {
  shares: Partial<Record<ResidentialEnergyVector, string>>
  total: Partial<Record<ResidentialEnergyVector, string>>
}): Readonly<Record<ResidentialEnergyVector, HousingSurface>> {
  const surfaceOf = (vector: ResidentialEnergyVector): HousingSurface => ({
    eligibleShare: quantity<'Fraction'>(shares[vector] ?? '1'),
    total: quantity<'SquareMetres'>(total[vector] ?? LARGE_SURFACE),
  })
  return {
    electricity: surfaceOf('electricity'),
    naturalGas: surfaceOf('naturalGas'),
    fuelOil: surfaceOf('fuelOil'),
    liquefiedPetroleumGas: surfaceOf('liquefiedPetroleumGas'),
    heat: surfaceOf('heat'),
  }
}

function reduction({
  vectors,
  eligible = {},
  surface = {},
  renovated = '1',
  heatEmissionFactor = '0',
}: {
  vectors: VectorsInMwh
  eligible?: Partial<Record<ResidentialEnergyVector, string>>
  surface?: Partial<Record<ResidentialEnergyVector, string>>
  renovated?: string
  heatEmissionFactor?: string
}): string {
  return calculateResidentielRenovationReduction({
    renovatedParcFraction: quantity<'Fraction'>(renovated),
    consumption: consumptionOf(vectors),
    housingSurfaces: surfacesOf({ shares: eligible, total: surface }),
    heatEmissionFactor: quantity<'KgCo2ePerKwh'>(heatEmissionFactor),
  })
    .decimalPlaces(2)
    .toFixed()
}

describe('calculateResidentielRenovationReduction', () => {
  it.each([
    ['1 000 MWh d’électricité : 46,7 % de chauffage et d’ECS × 35 % × FE 0,0349806', { electricity: '1000' }, '5.72'],
    ['1 000 MWh de gaz naturel : 92,6 %', { naturalGas: '1000' }, '65.2'],
    ['1 000 MWh de fioul : 100 %', { fuelOil: '1000' }, '93.9'],
    ['1 000 MWh de GPL : 53,2 %', { liquefiedPetroleumGas: '1000' }, '42.3'],
  ])('à 100 %% du parc rénové et tout éligible, %s', (_label, vectors, expected) => {
    expect(reduction({ vectors })).toBe(expected)
  })

  it('1 000 MWh de chaleur à 0,1 kgCO2e/kWh : 100 % de chauffage et d’ECS × 35 % = 35 tCO2e', () => {
    expect(reduction({ vectors: { heat: '1000' }, heatEmissionFactor: '0.1' })).toBe('35')
  })

  it('applique la part éligible de chaque vecteur et la moitié du parc rénové : 61,54 tCO2e', () => {
    expect(
      reduction({
        vectors: {
          electricity: '1000',
          naturalGas: '1000',
          fuelOil: '1000',
          liquefiedPetroleumGas: '1000',
          heat: '1000',
        },
        eligible: {
          electricity: '0.5',
          naturalGas: '0.5',
          fuelOil: '0.2',
          liquefiedPetroleumGas: '0.8',
          heat: '1',
        },
        renovated: '0.5',
        heatEmissionFactor: '0.1',
      }),
    ).toBe('61.54')
  })

  it('ne rénove rien à 0 % du parc ni sans surface éligible', () => {
    const vectors = { naturalGas: '1000', fuelOil: '1000' }
    expect({
      none: reduction({ vectors, renovated: '0' }),
      noEligibleSurface: reduction({
        vectors,
        eligible: { naturalGas: '0', fuelOil: '0' },
      }),
    }).toEqual({ none: '0', noEligibleSurface: '0' })
  })
})

describe('collectifs d’après 1971 : niveau BBC rénovation', () => {
  it.each([
    ['gaz : plafond d’émissions 11 ÷ 0,201168 = 54,68 kWh/m², 32,60 + 38,14 tCO2e', { naturalGas: '1000' }, 'naturalGas', '70.74'],
    ['électricité : plafond d’énergie primaire 110 ÷ 1,9 = 57,89 kWh/m², 46,72 en dessous donc 2,86 tCO2e', { electricity: '1000' }, 'electricity', '2.86'],
    ['fioul : plafond d’émissions 41,00 kWh/m², 46,95 + 79,14 tCO2e', { fuelOil: '1000' }, 'fuelOil', '126.08'],
    ['GPL : plafond d’émissions 48,42 kWh/m², 21,15 + 5,42 tCO2e', { liquefiedPetroleumGas: '1000' }, 'liquefiedPetroleumGas', '26.57'],
  ] as const)('10 000 m² dont la moitié d’après 1971, %s', (_label, vectors, vector, expected) => {
    expect(
      reduction({ vectors, eligible: { [vector]: '0.5' }, surface: { [vector]: '10000' } }),
    ).toBe(expected)
  })

  it('plafonne l’électricité par l’énergie primaire : 5 000 m², 93,44 kWh/m² pour un plafond de 57,89, soit 2,86 + 3,11 tCO2e', () => {
    expect(
      reduction({
        vectors: { electricity: '1000' },
        eligible: { electricity: '0.5' },
        surface: { electricity: '5000' },
      }),
    ).toBe('5.97')
  })

  it('applique le parc rénové aux logements d’après 1971 comme aux autres : la moitié du parc donne 35,37 tCO2e pour le gaz', () => {
    expect(
      reduction({
        vectors: { naturalGas: '1000' },
        eligible: { naturalGas: '0.5' },
        surface: { naturalGas: '10000' },
        renovated: '0.5',
      }),
    ).toBe('35.37')
  })

  it('ne compte aucun gain BBC quand la consommation par m² est déjà sous le plafond : 100 000 m², 32,60 tCO2e', () => {
    expect(
      reduction({
        vectors: { naturalGas: '1000' },
        eligible: { naturalGas: '0.5' },
        surface: { naturalGas: '100000' },
      }),
    ).toBe('32.6')
  })

  it('ne compte aucun gain BBC sans logement d’après 1971 : tout éligible', () => {
    expect(
      reduction({
        vectors: { naturalGas: '1000' },
        eligible: { naturalGas: '1' },
        surface: { naturalGas: '10000' },
      }),
    ).toBe('65.2')
  })

  it('ne compte aucun gain BBC sans surface', () => {
    expect(
      reduction({
        vectors: { naturalGas: '1000' },
        eligible: { naturalGas: '0.5' },
        surface: { naturalGas: '0' },
      }),
    ).toBe('32.6')
  })

  it('plafonne la chaleur par ses émissions quand son facteur est non nul : facteur 0,2, plafond 55 kWh/m²', () => {
    expect(
      reduction({
        vectors: { heat: '1000' },
        eligible: { heat: '0.5' },
        surface: { heat: '10000' },
        heatEmissionFactor: '0.2',
      }),
    ).toBe('80')
  })

  it('plafonne la chaleur par l’énergie primaire quand son plafond d’émissions est plus haut : facteur 0,05, plafond 110 kWh/m², aucun gain BBC à 100 kWh/m²', () => {
    expect(
      reduction({
        vectors: { heat: '1000' },
        eligible: { heat: '0.5' },
        surface: { heat: '10000' },
        heatEmissionFactor: '0.05',
      }),
    ).toBe('8.75')
  })
})
