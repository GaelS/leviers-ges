import type { Fraction, KgCo2ePerTonneKilometre, KgCo2ePerVehicleKilometre, Tonnes, Vehicles } from './units.ts';
type HeavyVehicleEmissionFactors = {
    readonly thermal: KgCo2ePerTonneKilometre;
    readonly mixed: KgCo2ePerTonneKilometre;
    readonly zeroEmissionShare: Fraction;
};
declare const HEAVY_VEHICLE_LOADING_RATE: Tonnes;
declare const ELECTRIC_HEAVY_VEHICLE_EMISSION_FACTOR: KgCo2ePerTonneKilometre;
declare function calculateThermalShare(zeroEmissionShare: Fraction): Fraction;
declare function calculateHeavyVehicleEmissionFactors({ dieselEmissionFactor, heavyVehicleFleet, zeroEmissionFleet, }: {
    dieselEmissionFactor: KgCo2ePerVehicleKilometre;
    heavyVehicleFleet: Vehicles;
    zeroEmissionFleet: Vehicles;
}): HeavyVehicleEmissionFactors;
export { calculateHeavyVehicleEmissionFactors, calculateThermalShare, ELECTRIC_HEAVY_VEHICLE_EMISSION_FACTOR, HEAVY_VEHICLE_LOADING_RATE, };
export type { HeavyVehicleEmissionFactors };
