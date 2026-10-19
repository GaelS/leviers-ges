import type { Result } from 'neverthrow'
import { toPassengerTransportAssumptions } from '../../application/data/transport-personnes/to-passenger-transport-assumptions.ts'
import type { EstimationContext } from '../../application/estimate/estimation-context.ts'
import {
  toEstimateResult,
  type EstimateResult,
} from '../../application/estimate/estimate-result.ts'
import type { DataSourceError } from '../../domain/data-source.ts'
import type { UnknownTerritory } from '../../domain/territory-index.ts'
import { calculateTransportPersonnesSobrieteDeplacementsReduction } from './calculate-transport-personnes-sobriete-deplacements-reduction.ts'
import { getSobrieteInputs } from './data/get-sobriete-inputs.ts'
import type { TransportPersonnesSobrieteDeplacementsRequest } from './transport-personnes-sobriete-deplacements-request.ts'

function estimate(
  { territory, parameters }: TransportPersonnesSobrieteDeplacementsRequest,
  { dataSource, getCommunesOf, getRegionByCommune }: EstimationContext,
): Result<EstimateResult, DataSourceError | UnknownTerritory> {
  return getCommunesOf(territory)
    .andThen((communes) =>
      getSobrieteInputs({
        dataSource,
        territory,
        communes,
        requestedRailShare: parameters.railShareFraction,
        getRegionByCommune,
      }),
    )
    .map(({ transportInputs, railShare, railEmissionFactor }) =>
      toEstimateResult(
        calculateTransportPersonnesSobrieteDeplacementsReduction({
          distanceReduction: parameters.commutingDistanceReductionFraction,
          railShare: railShare.fraction,
          railEmissionFactor: railEmissionFactor.emissionFactor,
          flows: transportInputs,
        }),
        toPassengerTransportAssumptions({ transportInputs, railShare, railEmissionFactor }),
      ),
    )
}

export { estimate }
