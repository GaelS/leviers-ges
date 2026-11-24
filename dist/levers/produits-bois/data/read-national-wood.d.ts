import { Result } from 'neverthrow';
import { type DataSource, type DataSourceError } from '../../../domain/data-source.ts';
import type { NationalWood } from './wood-production.ts';
declare function readNationalWood(dataSource: DataSource): Result<NationalWood, DataSourceError>;
export { readNationalWood };
