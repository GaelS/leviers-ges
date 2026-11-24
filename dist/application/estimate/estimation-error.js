function invalidRequest(issues) {
    return { kind: 'invalid_request', issues };
}
function levelNotComputed({ lever, level }) {
    return { kind: 'level_not_computed', lever, level };
}
export { invalidRequest, levelNotComputed };
//# sourceMappingURL=estimation-error.js.map