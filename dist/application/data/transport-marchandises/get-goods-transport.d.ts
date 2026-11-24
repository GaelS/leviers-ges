import type { Result } from 'neverthrow';
import type { DataSource, DataSourceError } from '../../../domain/data-source.ts';
import { type HeavyVehicleEmissionFactors } from '../../../domain/heavy-vehicle-emission-factor.ts';
import type { ComputedLevels } from '../../../domain/lever-registry.ts';
import type { Territory } from '../../../domain/territory.ts';
import type { GoodsTransportInputs } from './goods-transport-inputs.ts';
type GoodsTransport = {
    readonly inputs: GoodsTransportInputs;
    readonly emissionFactors: HeavyVehicleEmissionFactors;
};
declare function getGoodsTransport({ dataSource, territory, }: {
    dataSource: DataSource;
    territory: Territory<ComputedLevels<'transport_marchandises_sobriete_logistique'>>;
}): Result<GoodsTransport, DataSourceError>;
export { getGoodsTransport };
export type { GoodsTransport };
