import { quantity } from "../../domain/units.js";
// Source : Label bas carbone, méthode Haies, webinaire du 25/01/2021 p. 6 et page de la méthode,
// rubrique « Les réductions d'émissions » : carbone du sol 0,77 + biomasse racinaire 0,4 tCO2e/km/an
// (bornes basses des deux, biomasse aérienne non comptée). PlanET V1, onglet GestionHaies, constante FS
const HEDGE_STORAGE_FACTOR = quantity('1.17');
function calculateHaiesReduction(hedgeKmCreatedPerYear, storageFactor) {
    return quantity(hedgeKmCreatedPerYear.times(storageFactor).toFixed());
}
export { calculateHaiesReduction, HEDGE_STORAGE_FACTOR };
//# sourceMappingURL=calculate-haies-reduction.js.map