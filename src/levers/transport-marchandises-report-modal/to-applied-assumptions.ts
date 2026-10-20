import { toGoodsTransportAssumptions } from '../../application/data/transport-marchandises/to-goods-transport-assumptions.ts'
import type { GoodsTransport } from '../../application/data/transport-marchandises/get-goods-transport.ts'
import type { AppliedAssumptions } from '../../application/estimate/estimate-result.ts'
import {
  DEFAULT_CYCLOLOGISTIC_TONNE_KILOMETRES,
  RAIL_FREIGHT_EMISSION_FACTOR,
  WATERWAY_FREIGHT_EMISSION_FACTOR,
} from './report-modal-constants.ts'

function toModalShiftAssumptions(): AppliedAssumptions {
  return {
    railFreightEmissionFactor: {
      value: RAIL_FREIGHT_EMISSION_FACTOR.toFixed(),
      source:
        'Base Empreinte, element 47691 (average train, average load, continental France): combustion 0.004715 plus upstream 0.002563, manufacturing left out (DonneesReference!D42)',
      limit: 'One factor for every region, traction and load; the share of upstream counted is not given by the spreadsheet',
    },
    waterwayFreightEmissionFactor: {
      value: WATERWAY_FREIGHT_EMISSION_FACTOR.toFixed(),
      source:
        'FE_fluvial!D25: mean of six Base Empreinte factors by vessel class, combustion only, weighted by the number of vessels of the VNF active fleet 2016',
      limit:
        'Combustion only, where the rail factor adds upstream; 344 non-motorised barges (32%) take the factors of motorised vessels',
    },
    modalShiftCoefficients: {
      value: 'rail 0.8064 road and 1.0164 rail, waterway 0.8176 road and 0.9576 waterway',
      source: 'TrsptMarch_ReportModal, drawn formula and B13: analysis of the CEE REMOVE programme',
      limit:
        'The four coefficients are not found in the REMOVE guides, FAQ and manuals read. The drawn formula pairs the rail share with the waterway factor and the reverse: the pairing follows the Scénario global (formula-corrections.md, number 3)',
    },
  }
}

function toCyclologisticAssumption(
  cyclologisticTonneKilometres: string | undefined,
): AppliedAssumptions {
  if (cyclologisticTonneKilometres !== undefined) return {}
  return {
    cyclologisticTonneKilometres: {
      value: DEFAULT_CYCLOLOGISTIC_TONNE_KILOMETRES.toFixed(),
      source: 'ParametreDeterminants: no default value in the spreadsheet',
      limit:
        'Cyclologistics removes its tonne-km from the base of the shifts and credits no avoided emission: raising it lowers the reduction. The spreadsheet gives no cap: above the tonne-km of the region the base is negative',
    },
  }
}

function toAppliedAssumptions({
  goodsTransport,
  cyclologisticTonneKilometres,
}: {
  goodsTransport: GoodsTransport
  cyclologisticTonneKilometres: string | undefined
}): AppliedAssumptions {
  return {
    ...toGoodsTransportAssumptions(goodsTransport),
    ...toModalShiftAssumptions(),
    ...toCyclologisticAssumption(cyclologisticTonneKilometres),
  }
}

export { toAppliedAssumptions }
