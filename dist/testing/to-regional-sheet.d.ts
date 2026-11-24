type RegionalValues = {
    readonly ca2: string;
    readonly ca4: string;
    readonly ca5: string;
    readonly ca8: string;
};
declare const OLDER_YEAR_VALUES: RegionalValues;
declare function toRegionalSheet({ code, values, olderValues, }: {
    code?: unknown;
    values: RegionalValues;
    olderValues?: RegionalValues;
}): readonly (readonly unknown[])[];
export { OLDER_YEAR_VALUES, toRegionalSheet };
export type { RegionalValues };
