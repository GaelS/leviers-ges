import { type EstimateResult } from '../../application/estimate/estimate-result.ts';
import type { PratiquesStockantesRequest } from './pratiques-stockantes-request.ts';
declare function estimate({ parameters }: PratiquesStockantesRequest): EstimateResult;
export { estimate };
