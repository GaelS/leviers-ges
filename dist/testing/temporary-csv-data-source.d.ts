import type { DataRow, DataSource } from '../domain/data-source.ts';
import type { Level } from '../domain/territory.ts';
type DatasetFixture = {
    readonly keyColumn: string;
    readonly level?: Level;
    readonly rows: readonly DataRow[];
};
type DatasetFixtures = Readonly<Record<string, DatasetFixture>>;
declare function createTemporaryCsvDataSource(fixtures: DatasetFixtures): DataSource;
export { createTemporaryCsvDataSource };
export type { DatasetFixture };
