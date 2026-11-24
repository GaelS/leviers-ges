import { Result, err, ok } from 'neverthrow';
import { requireNonEmptyColumn, requireQuantityColumn, } from "../../../application/require-column.js";
import { invalidDataset, missingData, } from "../../../domain/data-source.js";
import { apportionWoodProduction, } from "./apportion-wood-production.js";
import { toWoodProduction } from "./to-wood-production.js";
const epciForestDataset = 'produits-bois/foret-epci-departement';
const departementForestDataset = 'produits-bois/foret-departement';
const departementsDataset = 'produits-bois/departements';
function toEpciForest(row) {
    const dataset = epciForestDataset;
    return Result.combine([
        requireNonEmptyColumn({ dataset, row, column: 'code_departement' }),
        requireQuantityColumn({
            dataset,
            row,
            column: 'forest_hectares',
        }),
    ]).map(([departement, hectares]) => ({ departement, hectares }));
}
function readEpciForests({ dataSource, territory, }) {
    return dataSource.rows(epciForestDataset).andThen((rows) => {
        const epciRows = rows.filter((row) => row['code_epci'] === territory.code);
        return epciRows.length === 0
            ? err(missingData({ dataset: epciForestDataset, key: territory.code }))
            : Result.combine(epciRows.map(toEpciForest));
    });
}
function findDepartementRow({ dataset, rows, departement, }) {
    const found = rows.find((row) => row['code_departement'] === departement);
    return found === undefined ? err(missingData({ dataset, key: departement })) : ok(found);
}
function toContribution({ epciForest, forestRows, productionRows, }) {
    const { departement, hectares } = epciForest;
    return Result.combine([
        findDepartementRow({
            dataset: departementForestDataset,
            rows: forestRows,
            departement,
        }).andThen((row) => requireQuantityColumn({
            dataset: departementForestDataset,
            row,
            column: 'forest_hectares',
        })),
        findDepartementRow({
            dataset: departementsDataset,
            rows: productionRows,
            departement,
        }).andThen((row) => toWoodProduction({ dataset: departementsDataset, row })),
    ]).andThen(([departementForest, departementProduction]) => hectares.isGreaterThan(departementForest)
        ? err(invalidDataset({
            dataset: epciForestDataset,
            reason: 'control_total_mismatch',
            detail: `${departement}: forest_hectares=${hectares.toFixed()} exceeds the department's ${departementForest.toFixed()}`,
        }))
        : ok({ epciForest: hectares, departementForest, departementProduction }));
}
function readEpciWoodProduction({ dataSource, territory, }) {
    return Result.combine([
        readEpciForests({ dataSource, territory }),
        dataSource.rows(departementForestDataset),
        dataSource.rows(departementsDataset),
    ])
        .andThen(([epciForests, forestRows, productionRows]) => Result.combine(epciForests.map((epciForest) => toContribution({ epciForest, forestRows, productionRows }))))
        .map(apportionWoodProduction);
}
export { readEpciWoodProduction };
//# sourceMappingURL=read-epci-wood-production.js.map