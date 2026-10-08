import { describe, expect, it } from 'vitest'
import type { HeatNetwork } from '../../../domain/heat-network.ts'
import { quantity } from '../../../domain/units.ts'
import { weightHeatEmissionFactor } from './weight-heat-emission-factor.ts'

function network(deliveredMwh: string, emissionFactor: string): HeatNetwork {
  return {
    deliveredMwh: quantity<'MegawattHours'>(deliveredMwh),
    emissionFactor: quantity<'KgCo2ePerKwh'>(emissionFactor),
  }
}

describe('weightHeatEmissionFactor', () => {
  it('pondère le facteur de chaque réseau par la chaleur livrée au résidentiel', () => {
    const networks = [network('1000', '0.1'), network('3000', '0.2')]
    expect(weightHeatEmissionFactor(networks).toFixed()).toBe('0.175')
  })

  it('rend le facteur du réseau unique', () => {
    expect(weightHeatEmissionFactor([network('500', '0.2')]).toFixed()).toBe('0.2')
  })

  it('compte pour 0 un territoire sans réseau', () => {
    expect(weightHeatEmissionFactor([]).toFixed()).toBe('0')
  })

  it('compte pour 0 des réseaux qui ne livrent rien au résidentiel', () => {
    expect(weightHeatEmissionFactor([network('0', '0.3')]).toFixed()).toBe('0')
  })
})
