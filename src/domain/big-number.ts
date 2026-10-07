import BigNumber from 'bignumber.js'
import { Result } from 'neverthrow'

const Big = BigNumber.clone({
  DECIMAL_PLACES: 30,
  ROUNDING_MODE: BigNumber.ROUND_HALF_UP,
  STRICT: true,
})

function toBig(value: string | bigint): BigNumber {
  return new Big(value)
}

const parseBig = Result.fromThrowable(
  (value: string): BigNumber => new Big(value),
  (): 'not_a_number' => 'not_a_number',
)

function sum(values: readonly BigNumber[]): BigNumber {
  return values.reduce((total, value) => total.plus(value), toBig('0'))
}

function roundOutput(value: BigNumber): BigNumber {
  return value.decimalPlaces(2)
}

export { parseBig, roundOutput, sum, toBig }
