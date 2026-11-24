import { Result } from 'neverthrow';
function areAllCommunesInRegion({ communes, regionCode, getRegionByCommune, }) {
    return Result.combine(communes.map(getRegionByCommune)).map((regions) => regions.length > 0 && regions.every((region) => region === regionCode));
}
export { areAllCommunesInRegion };
//# sourceMappingURL=are-all-communes-in-region.js.map