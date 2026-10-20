import type { GoodsTransport } from '../../application/data/transport-marchandises/get-goods-transport.ts'
import { toGoodsTransportAssumptions } from '../../application/data/transport-marchandises/to-goods-transport-assumptions.ts'
import type { AppliedAssumptions } from '../../application/estimate/estimate-result.ts'
import { ECODRIVING_POTENTIAL } from './calculate-transport-marchandises-efficacite-reduction.ts'

function toEcodrivingAssumption(): AppliedAssumptions {
  return {
    ecodrivingPotential: {
      value: ECODRIVING_POTENTIAL.toFixed(),
      source:
        'DonneesReference!D29 ("~15%"); eco-driving page of mission-transition-ecologique.beta.gouv.fr: "up to 15% of fuel"',
      limit:
        "An upper bound taken for a mean. The ADEME EVE guide for freight gives 5 to 15% (10% on average), fading to about 3% over three years; one potential for every heavy vehicle although the guide distinguishes activities",
    },
  }
}

function toAppliedAssumptions(goodsTransport: GoodsTransport): AppliedAssumptions {
  return { ...toGoodsTransportAssumptions(goodsTransport), ...toEcodrivingAssumption() }
}

export { toAppliedAssumptions }
