import { type EstimateResult } from '../../application/estimate/estimate-result.ts';
import type { HaiesRequest } from './haies-request.ts';
declare function estimate({ parameters }: HaiesRequest): EstimateResult;
export { estimate };
