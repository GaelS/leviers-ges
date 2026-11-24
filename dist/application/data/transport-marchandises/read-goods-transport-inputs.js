import { Result } from 'neverthrow';
import { GRAMS_PER_KILOGRAM, TONNE_KILOMETRES_PER_BILLION } from "../../../domain/mass-conversions.js";
import { quantity } from "../../../domain/units.js";
import { requireQuantityColumn } from "../../require-column.js";
const regionsDataset = 'transport-marchandises/regions';
function readGoodsTransportInputs({ dataSource, territory, }) {
    const dataset = regionsDataset;
    return dataSource.row(dataset, territory).andThen((row) => Result.combine([
        requireQuantityColumn({
            dataset,
            row,
            column: 'billion_tonne_kilometres',
        }),
        requireQuantityColumn({ dataset, row, column: 'heavy_vehicle_fleet' }),
        requireQuantityColumn({ dataset, row, column: 'zero_emission_heavy_vehicle_fleet' }),
        requireQuantityColumn({
            dataset,
            row,
            column: 'diesel_emission_factor_g_per_vehicle_km',
        }),
        requireQuantityColumn({ dataset, row, column: 'diesel_unclassified_share' }),
    ]).map(([billionTonneKilometres, heavyVehicleFleet, zeroEmissionFleet, dieselGramsPerVehicleKm, dieselUnclassifiedShare,]) => ({
        tonneKilometres: quantity(billionTonneKilometres.times(TONNE_KILOMETRES_PER_BILLION).toFixed()),
        heavyVehicleFleet,
        zeroEmissionFleet,
        dieselEmissionFactor: quantity(dieselGramsPerVehicleKm.dividedBy(GRAMS_PER_KILOGRAM).toFixed()),
        dieselUnclassifiedShare,
    })));
}
export { readGoodsTransportInputs };
//# sourceMappingURL=read-goods-transport-inputs.js.map