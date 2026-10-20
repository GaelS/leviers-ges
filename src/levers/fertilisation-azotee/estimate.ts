import type { Result } from 'neverthrow'
import type { EstimationContext } from '../../application/estimate/estimation-context.ts'
import {
  toEstimateResult,
  type EstimateResult,
} from '../../application/estimate/estimate-result.ts'
import type { DataSourceError } from '../../domain/data-source.ts'
import { calculateFertilisationAzoteeReduction } from './calculate-fertilisation-azotee-reduction.ts'
import { readNitrogenDelivered } from './data/read-nitrogen-delivered.ts'
import type { FertilisationAzoteeRequest } from './fertilisation-azotee-request.ts'
import { toAppliedAssumptions } from './to-applied-assumptions.ts'

function estimate(
  { territory, parameters }: FertilisationAzoteeRequest,
  { dataSource }: EstimationContext,
): Result<EstimateResult, DataSourceError> {
  return readNitrogenDelivered({ dataSource, territory }).map((delivered) =>
    toEstimateResult(
      calculateFertilisationAzoteeReduction({
        nitrogenReductionFraction: parameters.nitrogenReductionFraction,
        deliveredNitrogen: delivered.tonnes,
      }),
      toAppliedAssumptions(delivered),
    ),
  )
}

export { estimate }
