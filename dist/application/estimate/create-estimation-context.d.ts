import type { DataSource } from '../../domain/data-source.ts';
import type { EstimationContext } from './estimation-context.ts';
declare function createEstimationContext(dataSource: DataSource): EstimationContext;
export { createEstimationContext };
