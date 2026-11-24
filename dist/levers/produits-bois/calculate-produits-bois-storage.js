import { toBig } from "../../domain/big-number.js";
import { quantity } from "../../domain/units.js";
// Source : PlanET V1, onglet ProduitsBois, formule : 44/12, masse molaire du CO2 (44 g/mol)
const CARBON_DIOXIDE_MOLAR_MASS = toBig('44');
// Source : PlanET V1, onglet ProduitsBois, formule : 44/12, masse molaire du carbone (12 g/mol)
const CARBON_MOLAR_MASS = toBig('12');
function calculateProduitsBoisStorage({ woodProductionIncrease, territoryProduction, nationalProduction, productsCarbon, }) {
    const logsShare = territoryProduction.logs.dividedBy(nationalProduction.logs);
    const industrialWoodShare = territoryProduction.industrialWood.dividedBy(nationalProduction.industrialWood);
    const territoryTimberCarbon = productsCarbon.timber.times(logsShare);
    const territoryIndustrialCarbon = productsCarbon.industrial.times(industrialWoodShare);
    const territoryProductsCarbon = territoryTimberCarbon.plus(territoryIndustrialCarbon);
    const storedCarbonIncrease = territoryProductsCarbon.times(woodProductionIncrease);
    const storedCarbonDioxideMass = storedCarbonIncrease.times(CARBON_DIOXIDE_MOLAR_MASS);
    const storedCarbonDioxide = storedCarbonDioxideMass.dividedBy(CARBON_MOLAR_MASS);
    return quantity(storedCarbonDioxide.toFixed());
}
export { calculateProduitsBoisStorage };
//# sourceMappingURL=calculate-produits-bois-storage.js.map