import type BigNumber from 'bignumber.js'
import { err, ok, type Result } from 'neverthrow'
import { parseBig, toBig } from './big-number.js'
import { type InvalidParameter, invalidParameter } from './invalid-parameter.js'

type UnitName =
  | 'Fraction'
  | 'Kilometres'
  | 'Tonnes'
  | 'TonneKilometres'
  | 'Hectares'
  | 'TCo2ePerKmPerYear'
  | 'TonnesCo2ePerYear'

type Quantity<U extends UnitName> = BigNumber & { readonly unit: U }

type Fraction = Quantity<'Fraction'>
type Kilometres = Quantity<'Kilometres'>
type Tonnes = Quantity<'Tonnes'>
type TonneKilometres = Quantity<'TonneKilometres'>
type Hectares = Quantity<'Hectares'>
type TCo2ePerKmPerYear = Quantity<'TCo2ePerKmPerYear'>
type TonnesCo2ePerYear = Quantity<'TonnesCo2ePerYear'>

function quantity<U extends UnitName>(value: string | bigint): Quantity<U> {
  return toBig(value) as Quantity<U>
}

function parseFraction(value: string): Result<Fraction, InvalidParameter> {
  const parsed = parseBig(value)
  if (parsed.isErr()) return err(invalidParameter({ parameter: 'fraction', value }))
  const isOutsideZeroToOne = parsed.value.isLessThan(0) || parsed.value.isGreaterThan(1)
  if (isOutsideZeroToOne) return err(invalidParameter({ parameter: 'fraction', value }))
  return ok(quantity<'Fraction'>(value))
}

export { parseFraction, quantity }
export type {
  Fraction,
  Hectares,
  Kilometres,
  Quantity,
  TCo2ePerKmPerYear,
  TonneKilometres,
  Tonnes,
  TonnesCo2ePerYear,
  UnitName,
}
