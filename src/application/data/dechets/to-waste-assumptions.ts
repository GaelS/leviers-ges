import type BigNumber from 'bignumber.js'
import { sum } from '../../../domain/big-number.ts'
import type { WasteTypeTreatment } from '../../../domain/waste-treatment.ts'
import type { AppliedAssumptions } from '../../estimate/estimate-result.ts'

function tonnesWithoutEmissionFactor(wasteTypes: readonly WasteTypeTreatment[]): BigNumber {
  const withoutStorageFactor = wasteTypes
    .filter(({ storageEmissionFactor }) => storageEmissionFactor === undefined)
    .map(({ storageTonnes }) => storageTonnes)
  const withoutIncinerationFactor = wasteTypes
    .filter(({ incinerationEmissionFactor }) => incinerationEmissionFactor === undefined)
    .map(({ incinerationTonnes }) => incinerationTonnes)
  return sum([...withoutStorageFactor, ...withoutIncinerationFactor])
}

function toWasteScopeAssumption(): AppliedAssumptions {
  return {
    wasteScope: {
      value: 'treatment sites located in the territory',
      source:
        'DonneesTerritoires!L21: all treatment sites of the territory are consolidated; IREP 2022 register (Géorisques), non-hazardous waste of chapter 20, sites attached to the territory by their commune',
      limit:
        'The tonnes are those treated in the territory, not those produced by it: a territory without a treatment site has a null result whatever the percentages, and a region with large sites for its neighbours is overestimated. One vintage (2022)',
    },
  }
}

function toUncoveredWasteAssumption(wasteTypes: readonly WasteTypeTreatment[]): AppliedAssumptions {
  const uncoveredTonnes = tonnesWithoutEmissionFactor(wasteTypes)
  if (uncoveredTonnes.isZero()) return {}
  return {
    wasteTonnesWithoutEmissionFactor: {
      value: uncoveredTonnes.toFixed(),
      source:
        'FE_déchets: the Base Empreinte has no emission factor for some waste codes (mostly 20 02 02, soil and stones, which has no storage factor)',
      limit:
        'These tonnes, stored or incinerated, are ignored by the formula: their emissions are neither counted nor avoided',
    },
  }
}

function toWasteAssumptions(wasteTypes: readonly WasteTypeTreatment[]): AppliedAssumptions {
  return { ...toWasteScopeAssumption(), ...toUncoveredWasteAssumption(wasteTypes) }
}

export { toWasteAssumptions }
