import type { Result } from 'neverthrow';
import type { EstimationContext } from '../../application/estimate/estimation-context.ts';
import { type EstimateResult } from '../../application/estimate/estimate-result.ts';
import type { InvalidRequest } from '../../application/estimate/estimation-error.ts';
import type { DataSourceError } from '../../domain/data-source.ts';
import type { UnknownTerritory } from '../../domain/territory-index.ts';
import type { ResidentielChangementSystemeChauffageRequest } from './residentiel-changement-systeme-chauffage-request.ts';
declare function estimate({ territory, parameters }: ResidentielChangementSystemeChauffageRequest, { dataSource, getCommunesOf }: EstimationContext): Result<EstimateResult, DataSourceError | UnknownTerritory | InvalidRequest>;
export { estimate };
