import { Result } from 'neverthrow';
import { requireQuantityColumn } from "../../../application/require-column.js";
const factorsDatasets = {
    region: 'occupation-des-sols/regions-facteurs',
    departement: 'occupation-des-sols/departements-facteurs',
    epci: 'occupation-des-sols/epcis-facteurs',
};
function readFactor({ dataset, row, column, }) {
    return requireQuantityColumn({ dataset, row, column });
}
function toForestFactors({ dataset, row, grassland, }) {
    return Result.combine([
        readFactor({ dataset, row, column: `${grassland}_grassland_to_forest_mixed` }),
        readFactor({
            dataset,
            row,
            column: `${grassland}_grassland_to_forest_broadleaf`,
        }),
        readFactor({ dataset, row, column: `${grassland}_grassland_to_forest_conifer` }),
        readFactor({ dataset, row, column: `${grassland}_grassland_to_forest_poplar` }),
    ]).map(([mixed, broadleaf, conifer, poplar]) => ({ mixed, broadleaf, conifer, poplar }));
}
function toOccupationFactors({ dataset, row, }) {
    return Result.combine([
        toForestFactors({ dataset, row, grassland: 'wooded' }),
        toForestFactors({ dataset, row, grassland: 'herbaceous' }),
        toForestFactors({ dataset, row, grassland: 'shrub' }),
        readFactor({ dataset, row, column: 'cropland_to_wetland' }),
        readFactor({ dataset, row, column: 'wooded_grassland_to_wetland' }),
        readFactor({ dataset, row, column: 'herbaceous_grassland_to_wetland' }),
        readFactor({ dataset, row, column: 'shrub_grassland_to_wetland' }),
        readFactor({ dataset, row, column: 'impervious_to_artificial_shrub' }),
        readFactor({ dataset, row, column: 'impervious_to_artificial_wooded' }),
    ]).map(([wooded, herbaceous, shrub, croplandToWetland, woodedToWetland, herbaceousToWetland, shrubToWetland, imperviousToShrub, imperviousToWooded,]) => ({
        grasslandToForest: { wooded, herbaceous, shrub },
        toWetland: {
            cropland: croplandToWetland,
            grassland: { wooded: woodedToWetland, herbaceous: herbaceousToWetland, shrub: shrubToWetland },
        },
        imperviousToArtificial: { shrub: imperviousToShrub, wooded: imperviousToWooded },
    }));
}
function readOccupationFactors({ dataSource, territory, }) {
    const dataset = factorsDatasets[territory.level];
    return dataSource.row(dataset, territory).andThen((row) => toOccupationFactors({ dataset, row }));
}
export { readOccupationFactors };
//# sourceMappingURL=read-occupation-factors.js.map