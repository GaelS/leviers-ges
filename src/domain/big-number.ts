import BigNumber from 'bignumber.js'
import { err, ok, type Result } from 'neverthrow'

const Big = BigNumber.clone({
  DECIMAL_PLACES: 30,
  ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
  STRICT: true,
})

const decimalTextPattern = /^-?\d+(\.\d+)?$/

function toBig(value: string | bigint): BigNumber {
  return new Big(value)
}

function parseBig(value: string): Result<BigNumber, 'not_a_number'> {
  return decimalTextPattern.test(value) ? ok(new Big(value)) : err('not_a_number')
}

function sum(values: readonly BigNumber[]): BigNumber {
  return values.reduce((total, value) => total.plus(value), toBig('0'))
}

function roundOutput(value: BigNumber): BigNumber {
  return value.decimalPlaces(2)
}

export { parseBig, roundOutput, sum, toBig }
