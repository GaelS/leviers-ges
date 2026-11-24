import { sum, toBig } from "../../domain/big-number.js";
import { quantity, } from "../../domain/units.js";
// Source : choix de conception, non validé : sans aucune surface à convertir (ni prairie, ni forêt, ni prairie et culture, ni sol artificiel arboré et enherbé), le facteur moyen d'un terme vaut 0 plutôt qu'une division par zéro
const NO_FACTOR = toBig('0');
function calculateAverageFactor(entries) {
    const totalArea = sum(entries.map(({ area }) => area));
    if (totalArea.isZero())
        return NO_FACTOR;
    const weightedFactors = sum(entries.map(({ area, factor }) => area.times(factor)));
    return weightedFactors.dividedBy(totalArea);
}
function calculateFactorToForest({ type, areas, factors, }) {
    const { grassland } = areas;
    const { grasslandToForest } = factors;
    return calculateAverageFactor([
        { area: grassland.wooded, factor: grasslandToForest.wooded[type] },
        { area: grassland.herbaceous, factor: grasslandToForest.herbaceous[type] },
        { area: grassland.shrub, factor: grasslandToForest.shrub[type] },
    ]);
}
function calculateAfforestationFactor(input) {
    const { forest } = input.areas;
    return calculateAverageFactor([
        { area: forest.mixed, factor: calculateFactorToForest({ ...input, type: 'mixed' }) },
        { area: forest.broadleaf, factor: calculateFactorToForest({ ...input, type: 'broadleaf' }) },
        { area: forest.conifer, factor: calculateFactorToForest({ ...input, type: 'conifer' }) },
        { area: forest.poplar, factor: calculateFactorToForest({ ...input, type: 'poplar' }) },
    ]);
}
function calculateWetlandFactor({ areas, factors }) {
    const { cropland, grassland } = areas;
    return calculateAverageFactor([
        { area: cropland, factor: factors.toWetland.cropland },
        { area: grassland.wooded, factor: factors.toWetland.grassland.wooded },
        { area: grassland.herbaceous, factor: factors.toWetland.grassland.herbaceous },
        { area: grassland.shrub, factor: factors.toWetland.grassland.shrub },
    ]);
}
function calculateDesealingFactor({ areas, factors }) {
    return calculateAverageFactor([
        { area: areas.artificial.shrub, factor: factors.imperviousToArtificial.shrub },
        { area: areas.artificial.wooded, factor: factors.imperviousToArtificial.wooded },
    ]);
}
function calculateOccupationDesSolsStorage({ afforestationHectaresPerYear, wetlandDevelopmentHectaresPerYear, desealingHectaresPerYear, horizonYears, areas, factors, }) {
    const input = { areas, factors };
    const afforestedHectares = afforestationHectaresPerYear.times(horizonYears);
    const afforestationStorage = afforestedHectares.times(calculateAfforestationFactor(input));
    const wetlandHectares = wetlandDevelopmentHectaresPerYear.times(horizonYears);
    const wetlandStorage = wetlandHectares.times(calculateWetlandFactor(input));
    const desealingStorage = desealingHectaresPerYear.times(calculateDesealingFactor(input));
    const storage = sum([afforestationStorage, wetlandStorage, desealingStorage]);
    return quantity(storage.toFixed());
}
export { calculateOccupationDesSolsStorage };
//# sourceMappingURL=calculate-occupation-des-sols-storage.js.map