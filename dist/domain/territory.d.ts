import { z } from 'zod';
declare const levels: readonly ["departement", "epci", "region"];
type Level = (typeof levels)[number];
declare const territoryCodeSchema: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
type TerritoryCode = z.output<typeof territoryCodeSchema>;
type Territory<L extends Level> = {
    readonly level: L;
    readonly code: TerritoryCode;
};
export { levels, territoryCodeSchema };
export type { Level, Territory, TerritoryCode };
