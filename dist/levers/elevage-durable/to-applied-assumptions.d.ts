import type { AppliedAssumptions } from '../../application/estimate/estimate-result.ts';
import type { ElevageDurableRequest } from './elevage-durable-request.ts';
type RequestedAnimals = ElevageDurableRequest['parameters']['animals'];
declare function toAppliedAssumptions(animals: RequestedAnimals): AppliedAssumptions;
export { toAppliedAssumptions };
