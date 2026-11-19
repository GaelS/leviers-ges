import {
  toEstimateResult,
  type EstimateResult,
} from '../../application/estimate/estimate-result.ts'
import { calculatePratiquesStockantesReduction } from './calculate-pratiques-stockantes-reduction.ts'
import type { PratiquesStockantesRequest } from './pratiques-stockantes-request.ts'

function estimate({ parameters }: PratiquesStockantesRequest): EstimateResult {
  return toEstimateResult(
    calculatePratiquesStockantesReduction({
      intermediateCrops: parameters.intermediateCropsHectares,
      permanentVineyardGrassing: parameters.permanentVineyardGrassingHectares,
      winterIntercropVineyard: parameters.winterIntercropVineyardHectares,
      agroforestry: parameters.agroforestryHectares,
      temporaryGrasslandExtension: parameters.temporaryGrasslandExtensionHectares,
    }),
    {
      applicationSurfaceBounds: {
        value: 'none: each surface is taken as entered, from 0 hectares upwards',
        source:
          'PlanET functional documentation (June 2026), p. 78: no documented bound for the application surface of a stocking practice',
        limit:
          'The maximum application surface of each practice depends on the practice (grassland, orchards, vineyards or crops) and is not defined: an entry above the surface available in the territory is not refused',
      },
    },
  )
}

export { estimate }
