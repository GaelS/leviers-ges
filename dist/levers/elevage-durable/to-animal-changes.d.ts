import { type Fraction } from '../../domain/units.ts';
import type { AnimalChange } from './calculate-elevage-durable-reduction.ts';
import type { LivestockHeadcount } from './data/read-livestock-headcount.ts';
import type { ElevageDurableRequest } from './elevage-durable-request.ts';
type RequestedAnimals = ElevageDurableRequest['parameters']['animals'];
declare const DEFAULT_ENTERIC_EMISSION_REDUCTION: Fraction;
declare function toAnimalChanges({ animals, headcount, }: {
    animals: RequestedAnimals;
    headcount: LivestockHeadcount;
}): readonly AnimalChange[];
export { DEFAULT_ENTERIC_EMISSION_REDUCTION, toAnimalChanges };
