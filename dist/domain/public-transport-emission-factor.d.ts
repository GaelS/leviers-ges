import type BigNumber from 'bignumber.js';
import type { Fraction, KgCo2ePerPassengerKilometre, KgCo2ePerVehicleKilometre } from './units.ts';
declare function calculatePublicTransportEmissionFactor({ busEmissionFactor, railShare, railEmissionFactor, }: {
    busEmissionFactor: KgCo2ePerVehicleKilometre;
    railShare: Fraction;
    railEmissionFactor: KgCo2ePerPassengerKilometre;
}): BigNumber;
export { calculatePublicTransportEmissionFactor };
