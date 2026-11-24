import { calculateHeavyVehicleEmissionFactors, } from "../../../domain/heavy-vehicle-emission-factor.js";
import { readGoodsTransportInputs } from "./read-goods-transport-inputs.js";
function getGoodsTransport({ dataSource, territory, }) {
    return readGoodsTransportInputs({ dataSource, territory }).map((inputs) => ({
        inputs,
        emissionFactors: calculateHeavyVehicleEmissionFactors({
            dieselEmissionFactor: inputs.dieselEmissionFactor,
            heavyVehicleFleet: inputs.heavyVehicleFleet,
            zeroEmissionFleet: inputs.zeroEmissionFleet,
        }),
    }));
}
export { getGoodsTransport };
//# sourceMappingURL=get-goods-transport.js.map