import { Result } from 'neverthrow';
import type { DataSource, DataSourceError } from '../../../domain/data-source.ts';
import type { ComputedLevels } from '../../../domain/lever-registry.ts';
import type { Territory } from '../../../domain/territory.ts';
import type { Heads } from '../../../domain/units.ts';
import type { AnimalType } from './animal-types.ts';
type LivestockHeadcount = Readonly<Record<AnimalType, Heads>>;
declare function readLivestockHeadcount({ dataSource, territory, }: {
    dataSource: DataSource;
    territory: Territory<ComputedLevels<'elevage_durable'>>;
}): Result<LivestockHeadcount, DataSourceError>;
export { readLivestockHeadcount };
export type { LivestockHeadcount };
