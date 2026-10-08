import type BigNumber from 'bignumber.js'
import { err, ok, type Result } from 'neverthrow'
import { parseBig, toBig } from './big-number.ts'
import { type InvalidParameter, invalidParameter } from './invalid-parameter.ts'

type UnitName =
  | 'Fraction'
  | 'Kilometres'
  | 'Tonnes'
  | 'TonneKilometres'
  | 'Hectares'
  | 'TCo2ePerKmPerYear'
  | 'MegawattHours'
  | 'GigawattHours'
  | 'KgCo2ePerKwh'
  | 'KgCo2ePerGigajoule'
  | 'ThousandCubicMetres'
  | 'TonnesCarbon'
  | 'RelativeChange'
  | 'TonnesCo2ePerYear'

type Quantity<U extends UnitName> = BigNumber & { readonly unit: U }

type Fraction = Quantity<'Fraction'>
type Kilometres = Quantity<'Kilometres'>
type Tonnes = Quantity<'Tonnes'>
type TonneKilometres = Quantity<'TonneKilometres'>
type Hectares = Quantity<'Hectares'>
type TCo2ePerKmPerYear = Quantity<'TCo2ePerKmPerYear'>
type MegawattHours = Quantity<'MegawattHours'>
type GigawattHours = Quantity<'GigawattHours'>
type KgCo2ePerKwh = Quantity<'KgCo2ePerKwh'>
type KgCo2ePerGigajoule = Quantity<'KgCo2ePerGigajoule'>
type ThousandCubicMetres = Quantity<'ThousandCubicMetres'>
type TonnesCarbon = Quantity<'TonnesCarbon'>
type RelativeChange = Quantity<'RelativeChange'>
type TonnesCo2ePerYear = Quantity<'TonnesCo2ePerYear'>

function quantity<U extends UnitName>(value: string | bigint): Quantity<U> {
  return toBig(value) as Quantity<U>
}

// Source : BIPM, Le Système international d'unités (Brochure SI), 9e édition, préfixes SI :
// giga = 10^9 et méga = 10^6, donc 1 GWh = 1 000 MWh
const MEGAWATT_HOURS_PER_GIGAWATT_HOUR: BigNumber = toBig('1000')

function gigawattHoursToMegawattHours(gigawattHours: GigawattHours): MegawattHours {
  return quantity<'MegawattHours'>(gigawattHours.times(MEGAWATT_HOURS_PER_GIGAWATT_HOUR).toFixed())
}

function parseFraction(value: string): Result<Fraction, InvalidParameter> {
  const parsed = parseBig(value)
  if (parsed.isErr()) return err(invalidParameter({ parameter: 'fraction', value }))
  const isOutsideZeroToOne = parsed.value.isLessThan(0) || parsed.value.isGreaterThan(1)
  if (isOutsideZeroToOne) return err(invalidParameter({ parameter: 'fraction', value }))
  return ok(quantity<'Fraction'>(value))
}

export { gigawattHoursToMegawattHours, parseFraction, quantity }
export type {
  Fraction,
  GigawattHours,
  Hectares,
  KgCo2ePerGigajoule,
  KgCo2ePerKwh,
  Kilometres,
  MegawattHours,
  Quantity,
  RelativeChange,
  TCo2ePerKmPerYear,
  ThousandCubicMetres,
  TonneKilometres,
  Tonnes,
  TonnesCarbon,
  TonnesCo2ePerYear,
  UnitName,
}
