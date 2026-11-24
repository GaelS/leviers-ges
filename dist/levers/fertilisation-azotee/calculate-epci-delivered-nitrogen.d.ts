import { type Tonnes } from '../../domain/units.ts';
import type { EpciNitrogenPart } from './data/epci-nitrogen-part.ts';
declare function calculateEpciDeliveredNitrogen(parts: readonly EpciNitrogenPart[]): Tonnes;
export { calculateEpciDeliveredNitrogen };
