import { describe, expect, it } from 'vitest'
import {
  convertToKgPerKwh,
  ELECTRICITY_APPLIED_EMISSION_FACTOR,
  NATURAL_GAS_EMISSION_FACTOR,
} from './emission-factors.ts'
import { quantity } from './units.ts'

describe('emission-factors', () => {
  it('l’électricité vaut 0,0791 × 67,4 % = 0,0533134 kgCO2e/kWh', () => {
    expect(ELECTRICITY_APPLIED_EMISSION_FACTOR.toFixed()).toBe('0.0533134')
  })

  it('le gaz naturel vaut 55,88 kg/GJ × 0,0036 = 0,201168 kgCO2e/kWh', () => {
    expect(convertToKgPerKwh(NATURAL_GAS_EMISSION_FACTOR).toFixed()).toBe('0.201168')
  })

  it.each([
    ['74.52', '0.268272'],
    ['63.1', '0.22716'],
    ['78', '0.2808'],
    ['0', '0'],
  ])('convertit %s kg/GJ en %s kg/kWh', (kgPerGigajoule, expected) => {
    expect(convertToKgPerKwh(quantity<'KgCo2ePerGigajoule'>(kgPerGigajoule)).toFixed()).toBe(expected)
  })
})
