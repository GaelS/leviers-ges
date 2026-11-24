declare const ANIMAL_TYPES: readonly ["dairyCows", "otherCattle", "sows", "otherPigs", "goats", "sheep", "horses", "mulesAndDonkeys", "layingHens", "broilers", "otherPoultry"];
type AnimalType = (typeof ANIMAL_TYPES)[number];
export { ANIMAL_TYPES };
export type { AnimalType };
