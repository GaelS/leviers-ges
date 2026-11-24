import { Result } from 'neverthrow';
import type { DataSource, DataSourceError } from '../../domain/data-source.ts';
import type { HeatNetwork } from '../../domain/heat-network.ts';
declare const reseauxChaleurNetworksDataset = "reseaux-chaleur/networks";
declare function readHeatNetworks({ dataSource, dataset, communes, }: {
    dataSource: DataSource;
    dataset: string;
    communes: readonly string[];
}): Result<readonly HeatNetwork[], DataSourceError>;
export { readHeatNetworks, reseauxChaleurNetworksDataset };
