import type { AppliedAssumptions } from '../../estimate/estimate-result.ts';
import type { TransportInputs } from './transport-inputs.ts';
declare function toBusEmissionFactorAssumption(transportInputs: TransportInputs): AppliedAssumptions;
declare function toCarFleetUnclassifiedAssumption(transportInputs: TransportInputs): AppliedAssumptions;
declare function toBusFleetUnclassifiedAssumption(transportInputs: TransportInputs): AppliedAssumptions;
declare function toNationalCarAssumption(transportInputs: TransportInputs): AppliedAssumptions;
declare function toNationalBusAssumption(transportInputs: TransportInputs): AppliedAssumptions;
export { toBusEmissionFactorAssumption, toBusFleetUnclassifiedAssumption, toCarFleetUnclassifiedAssumption, toNationalBusAssumption, toNationalCarAssumption, };
