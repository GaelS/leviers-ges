import { ensureLevelComputed } from "../application/estimate/ensure-level-computed.js";
function estimateOnComputedLevel(request, estimateLever) {
    return ensureLevelComputed({
        lever: request.id,
        level: request.territory.level,
    }).andThen((level) => estimateLever({ ...request, territory: { ...request.territory, level } }));
}
export { estimateOnComputedLevel };
//# sourceMappingURL=estimate-on-computed-level.js.map