import { Result } from 'neverthrow';
import type { DataSource, DataSourceError } from '../../../domain/data-source.ts';
import type { ComputedLevels } from '../../../domain/lever-registry.ts';
import type { Territory } from '../../../domain/territory.ts';
import type { GoodsTransportInputs } from './goods-transport-inputs.ts';
declare function readGoodsTransportInputs({ dataSource, territory, }: {
    dataSource: DataSource;
    territory: Territory<ComputedLevels<'transport_marchandises_sobriete_logistique'>>;
}): Result<GoodsTransportInputs, DataSourceError>;
export { readGoodsTransportInputs };
