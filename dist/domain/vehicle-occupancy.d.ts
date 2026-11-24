import type BigNumber from 'bignumber.js';
declare const CAR_PASSENGERS_PER_VEHICLE: BigNumber;
declare const BUS_PASSENGERS_PER_VEHICLE: BigNumber;
declare function calculateEmissionFactorPerPassengerKm({ emissionFactorPerVehicleKm, passengersPerVehicle, }: {
    emissionFactorPerVehicleKm: BigNumber;
    passengersPerVehicle: BigNumber;
}): BigNumber;
declare function calculateCarEmissionFactorPerPassengerKm(carEmissionFactor: BigNumber): BigNumber;
declare function calculateBusEmissionFactorPerPassengerKm(busEmissionFactor: BigNumber): BigNumber;
export { BUS_PASSENGERS_PER_VEHICLE, calculateBusEmissionFactorPerPassengerKm, calculateCarEmissionFactorPerPassengerKm, calculateEmissionFactorPerPassengerKm, CAR_PASSENGERS_PER_VEHICLE, };
