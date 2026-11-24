import type { LeverId } from './lever-registry.ts';
type LeverLimit = {
    readonly limit: string;
    readonly effect: string;
};
declare const LEVER_LIMITS: Readonly<Record<LeverId, readonly LeverLimit[]>>;
export { LEVER_LIMITS };
export type { LeverLimit };
