import { type DataRow, type DataSource } from '../domain/data-source.ts';
declare function dataSourceFromDatasets(datasets: Readonly<Record<string, readonly DataRow[]>>): DataSource;
export { dataSourceFromDatasets };
