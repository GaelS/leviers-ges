import { Result, err, ok } from 'neverthrow';
import { parseBig } from "../../../domain/big-number.js";
import { invalidDataset, } from "../../../domain/data-source.js";
import { quantity } from "../../../domain/units.js";
const constantsDataset = 'produits-bois/constants';
// Source : data/produits-bois/manifest.json, clés de constants.csv construites par pnpm build:data:produits-bois
const CONSTANT_NAMES = {
    nationalLogs: 'national_logs_thousand_m3',
    nationalIndustrialWood: 'national_industrial_wood_thousand_m3',
    timberProductsCarbon: 'timber_products_carbon_tc',
    industrialProductsCarbon: 'industrial_products_carbon_tc',
};
function readQuantityConstant({ dataSource, name, }) {
    return dataSource
        .constant(constantsDataset, name)
        .andThen((value) => parseBig(value).isOk()
        ? ok(quantity(value))
        : err(invalidDataset({
            dataset: constantsDataset,
            reason: 'unreadable',
            detail: `${name}=${value} is not a decimal number`,
        })));
}
function readNationalWood(dataSource) {
    return Result.combine([
        readQuantityConstant({ dataSource, name: CONSTANT_NAMES.nationalLogs }),
        readQuantityConstant({
            dataSource,
            name: CONSTANT_NAMES.nationalIndustrialWood,
        }),
        readQuantityConstant({ dataSource, name: CONSTANT_NAMES.timberProductsCarbon }),
        readQuantityConstant({
            dataSource,
            name: CONSTANT_NAMES.industrialProductsCarbon,
        }),
    ]).map(([logs, industrialWood, timber, industrial]) => ({
        production: { logs, industrialWood },
        productsCarbon: { timber, industrial },
    }));
}
export { readNationalWood };
//# sourceMappingURL=read-national-wood.js.map