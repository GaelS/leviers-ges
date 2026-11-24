import { err, ok } from 'neverthrow';
import { parseBig, toBig } from "./big-number.js";
import { invalidParameter } from "./invalid-parameter.js";
function quantity(value) {
    return toBig(value);
}
// Source : BIPM, Le Système international d'unités (Brochure SI), 9e édition, préfixes SI :
// giga = 10^9 et méga = 10^6, donc 1 GWh = 1 000 MWh
const MEGAWATT_HOURS_PER_GIGAWATT_HOUR = toBig('1000');
function gigawattHoursToMegawattHours(gigawattHours) {
    return quantity(gigawattHours.times(MEGAWATT_HOURS_PER_GIGAWATT_HOUR).toFixed());
}
function parseFraction(value) {
    const parsed = parseBig(value);
    if (parsed.isErr())
        return err(invalidParameter({ parameter: 'fraction', value }));
    const isOutsideZeroToOne = parsed.value.isLessThan(0) || parsed.value.isGreaterThan(1);
    if (isOutsideZeroToOne)
        return err(invalidParameter({ parameter: 'fraction', value }));
    return ok(quantity(value));
}
export { gigawattHoursToMegawattHours, parseFraction, quantity };
//# sourceMappingURL=units.js.map