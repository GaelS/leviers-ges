import { Result } from 'neverthrow';
import type { EstimationContext } from '../../application/estimate/estimation-context.ts';
import { type EstimateResult } from '../../application/estimate/estimate-result.ts';
import type { DataSourceError } from '../../domain/data-source.ts';
import type { UnknownTerritory } from '../../domain/territory-index.ts';
import type { BatimentsMachinesAgricolesRequest } from './batiments-machines-agricoles-request.ts';
declare function estimate({ territory, parameters }: BatimentsMachinesAgricolesRequest, { dataSource, getCommunesOf, getRegionByCommune }: EstimationContext): Result<EstimateResult, DataSourceError | UnknownTerritory>;
export { estimate };
