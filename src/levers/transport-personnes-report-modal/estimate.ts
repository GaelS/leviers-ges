import type { Result } from 'neverthrow'
import { toPassengerTransportAssumptions } from '../../application/data/transport-personnes/to-passenger-transport-assumptions.ts'
import type { EstimationContext } from '../../application/estimate/estimation-context.ts'
import {
  toEstimateResult,
  type EstimateResult,
} from '../../application/estimate/estimate-result.ts'
import type { DataSourceError } from '../../domain/data-source.ts'
import type { UnknownTerritory } from '../../domain/territory-index.ts'
import { calculateTransportPersonnesReportModalReduction } from './calculate-transport-personnes-report-modal-reduction.ts'
import { getReportModalInputs } from './data/get-report-modal-inputs.ts'
import type { TransportPersonnesReportModalRequest } from './transport-personnes-report-modal-request.ts'

function estimate(
  { territory, parameters }: TransportPersonnesReportModalRequest,
  { dataSource, getCommunesOf, getRegionByCommune }: EstimationContext,
): Result<EstimateResult, DataSourceError | UnknownTerritory> {
  return getCommunesOf(territory)
    .andThen((communes) =>
      getReportModalInputs({
        dataSource,
        territory,
        communes,
        requestedRailShare: parameters.railShareFraction,
        getRegionByCommune,
      }),
    )
    .map(({ transportInputs, railShare, railEmissionFactor }) =>
      toEstimateResult(
        calculateTransportPersonnesReportModalReduction({
          fractions: {
            carToPublicTransport: parameters.carToPublicTransportFraction,
            carToActiveModes: parameters.carToActiveModesFraction,
          },
          railShare: railShare.fraction,
          railEmissionFactor: railEmissionFactor.emissionFactor,
          flows: transportInputs,
        }),
        toPassengerTransportAssumptions({ transportInputs, railShare, railEmissionFactor }),
      ),
    )
}

export { estimate }
