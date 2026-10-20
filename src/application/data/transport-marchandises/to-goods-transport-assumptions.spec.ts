import { describe, expect, it } from 'vitest'
import { calculateHeavyVehicleEmissionFactors } from '../../../domain/heavy-vehicle-emission-factor.ts'
import { quantity } from '../../../domain/units.ts'
import type { GoodsTransport } from './get-goods-transport-inputs.ts'
import { toGoodsTransportAssumptions } from './to-goods-transport-assumptions.ts'

const INPUTS = {
  tonneKilometres: quantity<'TonneKilometres'>('1000'),
  heavyVehicleFleet: quantity<'Vehicles'>('100'),
  zeroEmissionFleet: quantity<'Vehicles'>('10'),
  dieselEmissionFactor: quantity<'KgCo2ePerVehicleKilometre'>('0.81'),
  dieselUnclassifiedShare: quantity<'Fraction'>('0.09'),
}

const GOODS_TRANSPORT: GoodsTransport = {
  inputs: INPUTS,
  emissionFactors: calculateHeavyVehicleEmissionFactors({
    dieselEmissionFactor: INPUTS.dieselEmissionFactor,
    heavyVehicleFleet: INPUTS.heavyVehicleFleet,
    zeroEmissionFleet: INPUTS.zeroEmissionFleet,
  }),
}

describe('toGoodsTransportAssumptions', () => {
  it('renvoie les cinq hypothèses avec leurs valeurs', () => {
    const assumptions = toGoodsTransportAssumptions(GOODS_TRANSPORT)
    expect({
      factor: assumptions['heavyVehicleTripType']?.value,
      loading: assumptions['heavyVehicleLoadFactor']?.value,
      unclassified: assumptions['heavyVehicleFleet']?.value,
      electric: assumptions['electricHeavyVehicleEmissionFactor']?.value,
      flows: assumptions['includeInternationalFlows']?.limit,
    }).toEqual({
      factor: '0.1 kgCO2e per tonne-km for diesel heavy vehicles',
      loading: '8.1',
      unclassified: '0.09',
      electric: '0.0467',
      flows: expect.stringContaining('239.97') as string,
    })
  })
})
