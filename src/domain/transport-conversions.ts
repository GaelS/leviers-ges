import type BigNumber from 'bignumber.js'
import { toBig } from './big-number.ts'

// Source : TrsptPers_Efficacité, formule dessinée dans les formes de la feuille (fiche d'analyse 13) : « × 52,14 », semaines par an
const WEEKS_PER_YEAR: BigNumber = toBig('52.14')

// Source : BIPM, Le Système international d'unités (Brochure SI), 9e édition : kilo = 10^3, donc 1 t = 1 000 kg
const KILOGRAMS_PER_TONNE: BigNumber = toBig('1000')

export { KILOGRAMS_PER_TONNE, WEEKS_PER_YEAR }
