import type { HeatNetwork } from '../../domain/heat-network.ts';
import { type KgCo2ePerKwh } from '../../domain/units.ts';
declare function weightHeatEmissionFactor(networks: readonly HeatNetwork[]): KgCo2ePerKwh;
export { weightHeatEmissionFactor };
