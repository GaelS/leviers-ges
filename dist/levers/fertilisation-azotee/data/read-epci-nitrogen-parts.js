import { Result, err, ok } from 'neverthrow';
import { requireQuantityColumn } from "../../../application/require-column.js";
import { sum } from "../../../domain/big-number.js";
import { missingData, } from "../../../domain/data-source.js";
import { quantity } from "../../../domain/units.js";
import { readLocatedAreas } from "./read-located-areas.js";
import { readCampaignAverage } from "./read-campaign-average.js";
const nitrogenDataset = 'fertilisation-azotee/departements';
const epciOrganicDataset = 'fertilisation-azotee/organic-epci-departements';
const departementOrganicDataset = 'fertilisation-azotee/organic-departements';
function sumHectares(areas) {
    return quantity(sum(areas.map(({ hectares }) => hectares)).toFixed());
}
function toDepartementAreas({ areas, epciCommunes, }) {
    const epciAreas = areas.filter(({ commune }) => epciCommunes.has(commune));
    return [...Map.groupBy(epciAreas, ({ departement }) => departement)].map(([departement, inEpci]) => ({
        departement,
        epciArea: sumHectares(inEpci),
        departementArea: sumHectares(areas.filter((area) => area.departement === departement)),
    }));
}
function findRow({ dataset, rows, column, key, }) {
    const found = rows.find((row) => row[column] === key);
    return found === undefined ? err(missingData({ dataset, key })) : ok(found);
}
function readTonnes({ dataset, rows, departement, }) {
    return findRow({ dataset, rows, column: 'code_departement', key: departement }).andThen((row) => readCampaignAverage({ dataset, row }));
}
function readOrganicArea({ dataset, rows, column, key, }) {
    return findRow({ dataset, rows, column, key }).andThen((row) => requireQuantityColumn({ dataset, row, column: 'organic_hectares' }));
}
function toPart({ areas, organic, }) {
    const { departement, epciArea, departementArea } = areas;
    return Result.combine([
        readTonnes({ dataset: nitrogenDataset, rows: organic.nitrogenRows, departement }),
        readOrganicArea({
            dataset: epciOrganicDataset,
            rows: organic.epciRows,
            column: 'epci_departement',
            key: `${organic.epci}-${departement}`,
        }),
        readOrganicArea({
            dataset: departementOrganicDataset,
            rows: organic.departementRows,
            column: 'code_departement',
            key: departement,
        }),
    ]).map(([departementDelivered, epciOrganicArea, departementOrganicArea]) => ({
        departementDelivered,
        epciArea,
        epciOrganicArea,
        departementArea,
        departementOrganicArea,
    }));
}
function readEpciNitrogenParts({ dataSource, territory, getCommunesOf, getDepartementByCommune, }) {
    return getCommunesOf(territory).andThen((epciCommunes) => Result.combine([
        readLocatedAreas({ dataSource, getDepartementByCommune }),
        dataSource.rows(nitrogenDataset),
        dataSource.rows(epciOrganicDataset),
        dataSource.rows(departementOrganicDataset),
    ]).andThen(([areas, nitrogenRows, epciRows, departementRows]) => Result.combine(toDepartementAreas({ areas, epciCommunes: new Set(epciCommunes) })
        .filter(({ epciArea }) => !epciArea.isZero())
        .map((departementAreas) => toPart({
        areas: departementAreas,
        organic: { nitrogenRows, epciRows, departementRows, epci: territory.code },
    })))));
}
export { readEpciNitrogenParts };
//# sourceMappingURL=read-epci-nitrogen-parts.js.map