import type { Result } from 'neverthrow';
import type { EstimationError } from './application/estimate/estimation-error.ts';
import { type Estimate } from './estimator/estimate.ts';
type EstimateUntrustedRequest = (request: unknown) => Result<Estimate, EstimationError>;
declare function createDefaultEstimator(): EstimateUntrustedRequest;
export { createDefaultEstimator };
export type { EstimateUntrustedRequest };
