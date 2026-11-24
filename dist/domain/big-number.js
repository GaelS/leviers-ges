import BigNumber from 'bignumber.js';
import { err, ok } from 'neverthrow';
// Source : choix de conception de ce dépôt, sans source externe : marge de précision des divisions intermédiaires, non validé
const INTERMEDIATE_DECIMAL_PLACES = 30;
// Source : choix de conception de ce dépôt, sans source externe : précision d'affichage des résultats, non validé
const OUTPUT_DECIMAL_PLACES = 2;
const Big = BigNumber.clone({
    DECIMAL_PLACES: INTERMEDIATE_DECIMAL_PLACES,
    ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
    STRICT: true,
});
// Source : élément neutre de l'addition
const ZERO = new Big('0');
const decimalTextPattern = /^-?\d+(\.\d+)?$/;
const decimalTextWithExponentPattern = /^-?\d+(\.\d+)?([eE][+-]?\d+)?$/;
function toBig(value) {
    return new Big(value);
}
function numberToDecimalText(value) {
    return toBig(String(value)).toFixed();
}
function parseBig(value) {
    return decimalTextPattern.test(value) ? ok(new Big(value)) : err('not_a_number');
}
function parseBigWithExponent(value) {
    return decimalTextWithExponentPattern.test(value) ? ok(new Big(value)) : err('not_a_number');
}
function sum(values) {
    return values.reduce((total, value) => total.plus(value), ZERO);
}
function roundOutput(value) {
    return value.decimalPlaces(OUTPUT_DECIMAL_PLACES);
}
export { numberToDecimalText, parseBig, parseBigWithExponent, roundOutput, sum, toBig };
//# sourceMappingURL=big-number.js.map