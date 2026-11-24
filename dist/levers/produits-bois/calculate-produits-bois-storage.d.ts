import { type RelativeChange, type TonnesCo2ePerYear } from '../../domain/units.ts';
import type { ProductsCarbon, WoodProduction } from './data/wood-production.ts';
declare function calculateProduitsBoisStorage({ woodProductionIncrease, territoryProduction, nationalProduction, productsCarbon, }: {
    woodProductionIncrease: RelativeChange;
    territoryProduction: WoodProduction;
    nationalProduction: WoodProduction;
    productsCarbon: ProductsCarbon;
}): TonnesCo2ePerYear;
export { calculateProduitsBoisStorage };
