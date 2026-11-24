function memoizeOkByReferences(compute) {
    const cache = new WeakMap();
    return (first, second) => {
        const bySecond = cache.get(first) ?? new WeakMap();
        cache.set(first, bySecond);
        const cached = bySecond.get(second);
        if (cached !== undefined)
            return cached;
        const computed = compute(first, second);
        if (computed.isOk())
            bySecond.set(second, computed);
        return computed;
    };
}
export { memoizeOkByReferences };
//# sourceMappingURL=memoize-ok-by-references.js.map