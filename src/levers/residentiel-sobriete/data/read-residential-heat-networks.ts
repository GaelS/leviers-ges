import type { Result } from 'neverthrow'
import { readHeatNetworksOf } from '../../../application/heat-networks/read-heat-networks.ts'
import type { DataSource, DataSourceError } from '../../../domain/data-source.ts'
import type { HeatNetwork } from '../../../domain/heat-network.ts'

const residentialHeatNetworksDataset = 'residentiel-sobriete/heat-networks'

function readResidentialHeatNetworks({
  dataSource,
  communes,
}: {
  dataSource: DataSource
  communes: readonly string[]
}): Result<readonly HeatNetwork[], DataSourceError> {
  return readHeatNetworksOf({ dataSource, dataset: residentialHeatNetworksDataset, communes })
}

export { readResidentialHeatNetworks }
