import type { GoodsTransport } from '../../application/data/transport-marchandises/get-goods-transport.ts'
import { toGoodsTransportAssumptions } from '../../application/data/transport-marchandises/to-goods-transport-assumptions.ts'
import type { AppliedAssumptions } from '../../application/estimate/estimate-result.ts'
import { ECODRIVING_POTENTIAL } from './calculate-transport-marchandises-efficacite-reduction.ts'

function toEcodrivingAssumption(): AppliedAssumptions {
  return {
    ecodrivingPotential: {
      value: ECODRIVING_POTENTIAL.toFixed(),
      source:
        'Functional documentation (June 2026), 7.3.9, p. 66: the heavy vehicle potential is the passenger transport one, 10% by default (7.3.4.3, p. 61); the documentation also writes 15% on p. 66, settled by the team on 2026-11-19 in favour of 10%; the spreadsheet gives ~15% (DonneesReference!D29)',
      limit:
        "The ADEME EVE guide for freight gives 5 to 15% (10% on average), fading to about 3% over three years; one potential for every heavy vehicle although the guide distinguishes activities",
    },
  }
}

function toAppliedAssumptions(goodsTransport: GoodsTransport): AppliedAssumptions {
  return { ...toGoodsTransportAssumptions(goodsTransport), ...toEcodrivingAssumption() }
}

export { toAppliedAssumptions }
