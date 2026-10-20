import type BigNumber from 'bignumber.js'
import { toBig } from '../../domain/big-number.ts'
import { KILOGRAMS_PER_TONNE } from '../../domain/mass-conversions.ts'
import {
  quantity,
  type Fraction,
  type KgCo2ePerTonneKilometre,
  type RelativeChange,
  type TonneKilometres,
  type TonnesCo2ePerYear,
} from '../../domain/units.ts'

// Source : élément neutre de la multiplication
const ONE: BigNumber = toBig('1')

// Source : DonneesReference!D29, « ~15% » ; la page citée, mission-transition-ecologique.beta.gouv.fr (écoconduite), dit « jusqu'à 15 % de carburant ». Choix de conception, non validé : le même potentiel vaut pour tous les poids lourds, le guide EVE de l'ADEME donne 5 à 15 % (10 % en moyenne) qui s'estompent
const ECODRIVING_POTENTIAL: Fraction = quantity<'Fraction'>('0.15')

function calculateReductionFraction({
  ecodrivingApplication,
  loadFactorIncrease,
}: {
  ecodrivingApplication: Fraction
  loadFactorIncrease: RelativeChange
}): BigNumber {
  const increasedLoadFactor = ONE.plus(loadFactorIncrease)
  const loadFactorEffect = ONE.dividedBy(increasedLoadFactor)
  const ecodrivingGain = ecodrivingApplication.times(ECODRIVING_POTENTIAL)
  const ecodrivingEffect = ONE.minus(ecodrivingGain)
  const remainingEmissions = loadFactorEffect.times(ecodrivingEffect)
  return ONE.minus(remainingEmissions)
}

function calculateTransportMarchandisesEfficaciteReduction({
  ecodrivingApplication,
  loadFactorIncrease,
  tonneKilometres,
  emissionFactor,
}: {
  ecodrivingApplication: Fraction
  loadFactorIncrease: RelativeChange
  tonneKilometres: TonneKilometres
  emissionFactor: KgCo2ePerTonneKilometre
}): TonnesCo2ePerYear {
  const reductionFraction = calculateReductionFraction({ ecodrivingApplication, loadFactorIncrease })
  const annualEmissionsKg = tonneKilometres.times(emissionFactor)
  const avoidedEmissionsKg = annualEmissionsKg.times(reductionFraction)
  return quantity<'TonnesCo2ePerYear'>(avoidedEmissionsKg.dividedBy(KILOGRAMS_PER_TONNE).toFixed())
}

export { calculateTransportMarchandisesEfficaciteReduction, ECODRIVING_POTENTIAL }
