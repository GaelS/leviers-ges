import { Result } from 'neverthrow';
import type { RailEmissionFactor } from './rail-emission-factor.ts';
import { type RailShare } from './resolve-rail-share.ts';
import type { TransportInputs } from './transport-inputs.ts';
import type { RegionLookup } from '../../estimate/estimation-context.ts';
import type { DataSource, DataSourceError } from '../../../domain/data-source.ts';
import type { Level, Territory } from '../../../domain/territory.ts';
import type { Fraction } from '../../../domain/units.ts';
type PassengerTransportInputs = {
    readonly transportInputs: TransportInputs;
    readonly railShare: RailShare;
    readonly railEmissionFactor: RailEmissionFactor;
};
declare function getPassengerTransportInputs({ dataSource, territory, communes, requestedRailShare, getRegionByCommune, }: {
    dataSource: DataSource;
    territory: Territory<Level>;
    communes: readonly string[];
    requestedRailShare: Fraction | undefined;
    getRegionByCommune: RegionLookup;
}): Result<PassengerTransportInputs, DataSourceError>;
export { getPassengerTransportInputs };
