import BigNumber from 'bignumber.js';
import { type Result } from 'neverthrow';
declare function toBig(value: string | bigint): BigNumber;
declare function numberToDecimalText(value: number): string;
declare function parseBig(value: string): Result<BigNumber, 'not_a_number'>;
declare function parseBigWithExponent(value: string): Result<BigNumber, 'not_a_number'>;
declare function sum(values: readonly BigNumber[]): BigNumber;
declare function roundOutput(value: BigNumber): BigNumber;
export { numberToDecimalText, parseBig, parseBigWithExponent, roundOutput, sum, toBig };
