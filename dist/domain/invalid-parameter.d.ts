type InvalidParameter = {
    readonly kind: 'invalid_parameter';
    readonly parameter: string;
    readonly value: string;
};
declare function invalidParameter({ parameter, value, }: Pick<InvalidParameter, 'parameter' | 'value'>): InvalidParameter;
export { invalidParameter };
export type { InvalidParameter };
