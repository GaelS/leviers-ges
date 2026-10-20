import type { GoodsTransport } from '../../application/data/transport-marchandises/get-goods-transport.ts'
import {
  DISPLAYED_DECIMAL_PLACES,
  toGoodsTransportAssumptions,
} from '../../application/data/transport-marchandises/to-goods-transport-assumptions.ts'
import type { AppliedAssumptions } from '../../application/estimate/estimate-result.ts'
import type { Fraction } from '../../domain/units.ts'
import { calculateThermalShare } from '../../domain/heavy-vehicle-emission-factor.ts'

function toElectrificationCapAssumption({
  goodsTransport,
  requestedElectrifiedShare,
  electrifiedShare,
}: {
  goodsTransport: GoodsTransport
  requestedElectrifiedShare: Fraction
  electrifiedShare: Fraction
}): AppliedAssumptions {
  if (electrifiedShare.isEqualTo(requestedElectrifiedShare)) return {}
  const thermalShare = calculateThermalShare(goodsTransport.emissionFactors.zeroEmissionShare)
  return {
    additionalElectrifiedFleetFraction: {
      value: electrifiedShare.decimalPlaces(DISPLAYED_DECIMAL_PLACES).toFixed(),
      source:
        "SDES, Parc de véhicules routiers (RSVERO) at 1 January 2024: the thermal share of the region's heavy vehicles is the room left for electrification (ParametreDeterminants!D41: percentage points of additional electrification)",
      limit: thermalShare.isZero()
        ? 'Every heavy vehicle of the region is already zero-emission: nothing can be electrified'
        : 'The requestedElectrifiedShare share exceeds the share of thermal heavy vehicles of the region: only thermal heavy vehicles can be electrified, the requestedElectrifiedShare share is capped',
    },
  }
}

function toAppliedAssumptions({
  goodsTransport,
  requestedElectrifiedShare,
  electrifiedShare,
}: {
  goodsTransport: GoodsTransport
  requestedElectrifiedShare: Fraction
  electrifiedShare: Fraction
}): AppliedAssumptions {
  return {
    ...toGoodsTransportAssumptions(goodsTransport),
    ...toElectrificationCapAssumption({ goodsTransport, requestedElectrifiedShare, electrifiedShare }),
  }
}

export { toAppliedAssumptions }
