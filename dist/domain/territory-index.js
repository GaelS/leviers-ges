import { err, ok } from 'neverthrow';
function unknownTerritory({ level, code }) {
    return { kind: 'unknown_territory', level, code };
}
function hasEpci(commune) {
    return commune.epci !== undefined;
}
function buildTerritoryIndex(communes) {
    const communesByLevel = {
        region: Map.groupBy(communes, (commune) => commune.region),
        departement: Map.groupBy(communes, (commune) => commune.departement),
        epci: Map.groupBy(communes.filter(hasEpci), (commune) => commune.epci),
    };
    const regionByCommune = new Map(communes.map((commune) => [commune.code, commune.region]));
    const departementByCommune = new Map(communes.map((commune) => [commune.code, commune.departement]));
    function communesInTerritory({ level, code, }) {
        const found = communesByLevel[level].get(code);
        return found === undefined ? err(unknownTerritory({ level, code })) : ok(found);
    }
    return {
        communesOf: (territory) => communesInTerritory(territory).map((found) => found.map((commune) => commune.code).toSorted()),
        departementsOf: (epci) => communesInTerritory(epci).map((found) => [...new Set(found.map((commune) => commune.departement))].toSorted()),
        regionOf: (commune) => regionByCommune.get(commune),
        departementOf: (commune) => departementByCommune.get(commune),
    };
}
export { buildTerritoryIndex };
//# sourceMappingURL=territory-index.js.map