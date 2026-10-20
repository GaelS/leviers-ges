import type BigNumber from 'bignumber.js'
import { toBig } from './big-number.ts'
import type { KgCo2ePerTonne, Tonnes } from './units.ts'

type WasteTypeTreatment = {
  readonly wasteCode: string
  readonly storageTonnes: Tonnes
  readonly incinerationTonnes: Tonnes
  readonly storageEmissionFactor: KgCo2ePerTonne | undefined
  readonly incinerationEmissionFactor: KgCo2ePerTonne | undefined
}

// Source : élément neutre de l'addition : un terme dont un facteur d'émission manque (« — » dans FE_déchets) n'est pas calculé
const NO_EMISSIONS_KG: BigNumber = toBig('0')

export { NO_EMISSIONS_KG }
export type { WasteTypeTreatment }
