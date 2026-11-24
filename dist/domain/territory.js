import { z } from 'zod';
const levels = ['departement', 'epci', 'region'];
const territoryCodeSchema = z.string().trim().min(1, 'must not be empty').brand();
export { levels, territoryCodeSchema };
//# sourceMappingURL=territory.js.map