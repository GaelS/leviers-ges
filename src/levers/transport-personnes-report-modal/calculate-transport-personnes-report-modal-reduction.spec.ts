import { describe, expect, it } from 'vitest'
import { quantity } from '../../domain/units.ts'
import {
  calculatePublicTransportEmissionFactor,
  calculateTransportPersonnesReportModalReduction,
  type ReportModalFlows,
  type ReportModalFractions,
} from './calculate-transport-personnes-report-modal-reduction.ts'

const NO_SHIFT: ReportModalFractions = {
  carToPublicTransport: quantity<'Fraction'>('0'),
  carToActiveModes: quantity<'Fraction'>('0'),
}

function flows(overrides: Partial<Record<keyof ReportModalFlows, string>> = {}): ReportModalFlows {
  const values = {
    carWeeklyPassengerKm: '1000',
    carEmissionFactor: '0.1165',
    busEmissionFactor: '0.8',
    ...overrides,
  }
  return {
    carWeeklyPassengerKm: quantity<'PassengerKilometresPerWeek'>(values.carWeeklyPassengerKm),
    carEmissionFactor: quantity<'KgCo2ePerVehicleKilometre'>(values.carEmissionFactor),
    busEmissionFactor: quantity<'KgCo2ePerVehicleKilometre'>(values.busEmissionFactor),
  }
}

function reduction({
  fractions = NO_SHIFT,
  railShare = '0.6',
  railEmissionFactor = '0.02',
  input = flows(),
}: {
  fractions?: Partial<ReportModalFractions>
  railShare?: string
  railEmissionFactor?: string
  input?: ReportModalFlows
}): string {
  return calculateTransportPersonnesReportModalReduction({
    fractions: { ...NO_SHIFT, ...fractions },
    railShare: quantity<'Fraction'>(railShare),
    railEmissionFactor: quantity<'KgCo2ePerPassengerKilometre'>(railEmissionFactor),
    flows: input,
  })
    .decimalPlaces(6)
    .toFixed()
}

describe('calculateTransportPersonnesReportModalReduction', () => {
  it('ne réduit rien sans report', () => {
    expect(reduction({})).toBe('0')
  })

  it('reporte toute la voiture vers les transports en commun : 1 000 passagers.km par semaine, 60 % de ferré à 0,02, évitent 2,91984 tCO2e', () => {
    expect(reduction({ fractions: { carToPublicTransport: quantity<'Fraction'>('1') } })).toBe(
      '2.91984',
    )
  })

  it('reporte toute la voiture vers les modes actifs, sans émission : 1 000 passagers.km par semaine évitent 5,214 tCO2e', () => {
    expect(reduction({ fractions: { carToActiveModes: quantity<'Fraction'>('1') } })).toBe('5.214')
  })

  it('additionne les deux reports : moitié vers les transports en commun, moitié vers les modes actifs', () => {
    expect(
      reduction({
        fractions: {
          carToPublicTransport: quantity<'Fraction'>('0.5'),
          carToActiveModes: quantity<'Fraction'>('0.5'),
        },
      }),
    ).toBe('4.06692')
  })

  it('renvoie un résultat négatif quand le transport en commun émet plus que la voiture', () => {
    expect(
      reduction({
        fractions: { carToPublicTransport: quantity<'Fraction'>('1') },
        railShare: '0',
        input: flows({ carEmissionFactor: '0.0233' }),
      }),
    ).toBe('-3.1284')
  })

  it('est proportionnelle aux passagers.km en voiture', () => {
    expect(
      reduction({
        fractions: { carToActiveModes: quantity<'Fraction'>('1') },
        input: flows({ carWeeklyPassengerKm: '2000' }),
      }),
    ).toBe('10.428')
  })
})

describe('calculatePublicTransportEmissionFactor', () => {
  it('pondère le ferré et le bus par la part du ferré : 60 % à 0,02 et 40 % à 0,08 donnent 0,044', () => {
    expect(
      calculatePublicTransportEmissionFactor({
        busEmissionFactor: quantity<'KgCo2ePerVehicleKilometre'>('0.8'),
        railShare: quantity<'Fraction'>('0.6'),
        railEmissionFactor: quantity<'KgCo2ePerPassengerKilometre'>('0.02'),
      }).toFixed(),
    ).toBe('0.044')
  })
})
