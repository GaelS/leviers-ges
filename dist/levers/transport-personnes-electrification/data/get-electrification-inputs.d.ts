import { Result } from 'neverthrow';
import { type RailShare } from '../../../application/data/transport-personnes/resolve-rail-share.ts';
import type { TransportInputs } from '../../../application/data/transport-personnes/transport-inputs.ts';
import type { RegionLookup } from '../../../application/estimate/estimation-context.ts';
import type { DataSource, DataSourceError } from '../../../domain/data-source.ts';
import type { ComputedLevels } from '../../../domain/lever-registry.ts';
import type { Territory } from '../../../domain/territory.ts';
import type { Fraction } from '../../../domain/units.ts';
import type { ThermalFleet } from './thermal-fleet.ts';
type ElectrificationInputs = {
    readonly transportInputs: TransportInputs;
    readonly thermalFleet: ThermalFleet;
    readonly railShare: RailShare;
};
declare function getElectrificationInputs({ dataSource, territory, communes, requestedRailShare, getRegionByCommune, }: {
    dataSource: DataSource;
    territory: Territory<ComputedLevels<'transport_personnes_electrification'>>;
    communes: readonly string[];
    requestedRailShare: Fraction | undefined;
    getRegionByCommune: RegionLookup;
}): Result<ElectrificationInputs, DataSourceError>;
export { getElectrificationInputs };
