import type BigNumber from 'bignumber.js'
import { toBig } from './big-number.ts'

// Source : SDES, « Se déplacer en voiture » (graphique 2, mobilité locale, motif « Professionnel ») : 88 % seul, 9 % à deux, 3 % à trois ou plus à 3,5 passagers, soit 0,88 × 1 + 0,09 × 2 + 0,03 × 3,5 ; DonneesReference!D26
const CAR_PASSENGERS_PER_VEHICLE: BigNumber = toBig('1.165')

// Source : DonneesReference!D28, « On prend la valeur du taux de remplissage des bus (10 personnes) indistinctement pour tous les bus et cars »
const BUS_PASSENGERS_PER_VEHICLE: BigNumber = toBig('10')

export { BUS_PASSENGERS_PER_VEHICLE, CAR_PASSENGERS_PER_VEHICLE }
