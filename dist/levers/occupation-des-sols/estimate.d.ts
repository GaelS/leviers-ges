import { Result } from 'neverthrow';
import type { EstimationContext } from '../../application/estimate/estimation-context.ts';
import { type EstimateResult } from '../../application/estimate/estimate-result.ts';
import type { DataSourceError } from '../../domain/data-source.ts';
import type { OccupationDesSolsRequest } from './occupation-des-sols-request.ts';
declare function estimate({ territory, parameters }: OccupationDesSolsRequest, { dataSource }: EstimationContext): Result<EstimateResult, DataSourceError>;
export { estimate };
