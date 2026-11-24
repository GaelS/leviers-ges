import type { Result } from 'neverthrow';
import type { EstimationContext } from '../../application/estimate/estimation-context.ts';
import { type EstimateResult } from '../../application/estimate/estimate-result.ts';
import type { DataSourceError } from '../../domain/data-source.ts';
import type { UnknownTerritory } from '../../domain/territory-index.ts';
import type { DechetsSobrieteRequest } from './dechets-sobriete-request.ts';
declare function estimate({ territory, parameters }: DechetsSobrieteRequest, { dataSource, getCommunesOf }: EstimationContext): Result<EstimateResult, DataSourceError | UnknownTerritory>;
export { estimate };
