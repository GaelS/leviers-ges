import type { Result } from 'neverthrow';
import type { EstimationContext } from '../../application/estimate/estimation-context.ts';
import { type EstimateResult } from '../../application/estimate/estimate-result.ts';
import type { DataSourceError } from '../../domain/data-source.ts';
import type { TransportMarchandisesReportModalRequest } from './transport-marchandises-report-modal-request.ts';
declare function estimate({ territory, parameters }: TransportMarchandisesReportModalRequest, { dataSource }: EstimationContext): Result<EstimateResult, DataSourceError>;
export { estimate };
