import type BigNumber from 'bignumber.js'
import { sum, toBig } from '../../domain/big-number.ts'
import { WEEKS_PER_YEAR, KILOGRAMS_PER_TONNE } from '../../domain/transport-conversions.ts'
import {
  quantity,
  type Fraction,
  type KgCo2ePerPassengerKilometre,
  type KgCo2ePerVehicleKilometre,
  type PassengerKilometresPerWeek,
  type TonnesCo2ePerYear,
} from '../../domain/units.ts'
import {
  calculateBusEmissionFactorPerPassengerKm,
  calculateCarEmissionFactorPerPassengerKm,
} from '../../domain/vehicle-occupancy.ts'

type ReportModalFractions = {
  readonly carToPublicTransport: Fraction
  readonly carToActiveModes: Fraction
}

type ReportModalFlows = {
  readonly carWeeklyPassengerKm: PassengerKilometresPerWeek
  readonly carEmissionFactor: KgCo2ePerVehicleKilometre
  readonly busEmissionFactor: KgCo2ePerVehicleKilometre
}

// Source : élément neutre de la multiplication
const ONE: BigNumber = toBig('1')

function calculatePublicTransportEmissionFactor({
  busEmissionFactor,
  railShare,
  railEmissionFactor,
}: {
  busEmissionFactor: KgCo2ePerVehicleKilometre
  railShare: Fraction
  railEmissionFactor: KgCo2ePerPassengerKilometre
}): BigNumber {
  const roadShare = ONE.minus(railShare)
  const busEmissionFactorPerPassengerKm = calculateBusEmissionFactorPerPassengerKm(busEmissionFactor)
  const railContribution = railShare.times(railEmissionFactor)
  const roadContribution = roadShare.times(busEmissionFactorPerPassengerKm)
  return railContribution.plus(roadContribution)
}

function calculateTransportPersonnesReportModalReduction({
  fractions,
  railShare,
  railEmissionFactor,
  flows,
}: {
  fractions: ReportModalFractions
  railShare: Fraction
  railEmissionFactor: KgCo2ePerPassengerKilometre
  flows: ReportModalFlows
}): TonnesCo2ePerYear {
  const carEmissionFactorPerPassengerKm = calculateCarEmissionFactorPerPassengerKm(
    flows.carEmissionFactor,
  )
  const publicTransportEmissionFactor = calculatePublicTransportEmissionFactor({
    busEmissionFactor: flows.busEmissionFactor,
    railShare,
    railEmissionFactor,
  })
  const gainToPublicTransport = carEmissionFactorPerPassengerKm.minus(publicTransportEmissionFactor)
  const publicTransportAvoidedPerPassengerKm =
    fractions.carToPublicTransport.times(gainToPublicTransport)
  const activeModesAvoidedPerPassengerKm =
    fractions.carToActiveModes.times(carEmissionFactorPerPassengerKm)
  const avoidedPerPassengerKm = sum([
    publicTransportAvoidedPerPassengerKm,
    activeModesAvoidedPerPassengerKm,
  ])
  const annualPassengerKm = flows.carWeeklyPassengerKm.times(WEEKS_PER_YEAR)
  const avoidedEmissionsKg = annualPassengerKm.times(avoidedPerPassengerKm)
  return quantity<'TonnesCo2ePerYear'>(avoidedEmissionsKg.dividedBy(KILOGRAMS_PER_TONNE).toFixed())
}

export { calculatePublicTransportEmissionFactor, calculateTransportPersonnesReportModalReduction }
export type { ReportModalFlows, ReportModalFractions }
