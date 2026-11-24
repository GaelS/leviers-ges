import { err, ok } from 'neverthrow';
import { match } from 'ts-pattern';
import { getStatus, isComputedLevel, } from "../../domain/lever-registry.js";
import { levelNotComputed } from "./estimation-error.js";
function ensureLevelComputed({ lever, level, }) {
    return isComputedLevel(lever, level) ? ok(level) : err(levelNotComputed({ lever, level }));
}
function computedStatusOf({ lever, level, }) {
    return match(getStatus({ lever, level }))
        .with('no_open_question', 'workaround', (status) => ok(status))
        .with('not_computed', () => err(levelNotComputed({ lever, level })))
        .exhaustive();
}
export { computedStatusOf, ensureLevelComputed };
//# sourceMappingURL=ensure-level-computed.js.map