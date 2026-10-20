import type { AppliedAssumptions } from '../../application/estimate/estimate-result.ts'
import { ANIMAL_TYPES } from './data/animal-types.ts'
import type { ElevageDurableRequest } from './elevage-durable-request.ts'
import { DEFAULT_ENTERIC_EMISSION_REDUCTION } from './to-animal-changes.ts'

type RequestedAnimals = ElevageDurableRequest['parameters']['animals']

function toUnchangedAnimalsAssumption(animals: RequestedAnimals): AppliedAssumptions {
  const unchanged = ANIMAL_TYPES.filter((animalType) => animals[animalType] === undefined)
  if (unchanged.length === 0) return {}
  return {
    unchangedAnimals: {
      value: unchanged.join(', '),
      source: 'ElevageDurable: the formula sums over the animal types the request changes',
      limit:
        'These animal types are absent from the request: their headcount, enteric emissions and manure management are left as they are, so they contribute nothing to the reduction',
    },
  }
}

function toDefaultedEntericAssumption(animals: RequestedAnimals): AppliedAssumptions {
  const defaulted = ANIMAL_TYPES.filter((animalType) => {
    const requested = animals[animalType]
    return requested !== undefined && requested.entericEmissionReductionFraction === undefined
  })
  if (defaulted.length === 0) return {}
  return {
    entericEmissionReductionFraction: {
      value: DEFAULT_ENTERIC_EMISSION_REDUCTION.toFixed(),
      source: 'ParametreDeterminants!I9: default of the reduction of the enteric fermentation emission factor',
      limit: `Applied to: ${defaulted.join(', ')}. The spreadsheet announces a bound on this reduction (ParametreDeterminants!D9) without giving it`,
    },
  }
}

function toDigestionAssumption(animals: RequestedAnimals): AppliedAssumptions {
  const isDigestionRequested = ANIMAL_TYPES.some((animalType) => {
    const requested = animals[animalType]
    return requested !== undefined && !requested.targetManureShares.anaerobicDigestion.isZero()
  })
  if (!isDigestionRequested) return {}
  return {
    methanisationFactors: {
      value: 'conversion factor of 2.27% to methane, 0.0006 kg N-N2O per kg of nitrogen excreted',
      source: 'OMINEA 2026 of the CITEPA, cattle and pigs',
      limit:
        'The documents the spreadsheet cites give no factor for anaerobic digestion. Not available for the other animal types: a request that digests their manure is refused',
    },
  }
}

function toStaticAssumptions(): AppliedAssumptions {
  return {
    currentManureShares: {
      value: 'national shares of liquid manure, solid manure and pasture, anaerobic digestion at 0',
      source:
        'ElevageDurable!B15 and OMINEA 2013 of the CITEPA (2010 values, 1990-2011 for cattle), Base Carbone, Agriculture - cheptels',
      limit:
        'One national distribution for every territory: no pedoclimatic effect, and a territory that already digests part of its manure is not represented',
    },
    animalParameters: {
      value: 'OMINEA 2013 factors, Base Carbone, Agriculture - cheptels',
      source:
        'DonneesReference!D9 to D15: enteric factors, volatile solids, maximum methane capacity, conversion factors, nitrogen excretion (2011)',
      limit:
        'Thirteen years old: OMINEA 2026 gives 121.9 to 152.5 kg of CH4 per dairy cow (121 here) and 118.7 kg of nitrogen excreted (115.6 here). Volatile solids of cattle are the middle of the published range',
    },
    livestockHeadcounts: {
      value: 'agricultural census 2020, headcounts at the location of the holding',
      source:
        'Agreste, recensement agricole 2020, cheptels; cartostat for dairy cows (estimated by cartostat where Agreste is under statistical secret)',
      limit:
        'A holding on two départements is counted where its seat is. A category under statistical secret counts as zero, including when its parent is published (poultry, sows, equids)',
    },
  }
}

function toAppliedAssumptions(animals: RequestedAnimals): AppliedAssumptions {
  return {
    ...toUnchangedAnimalsAssumption(animals),
    ...toDefaultedEntericAssumption(animals),
    ...toDigestionAssumption(animals),
    ...toStaticAssumptions(),
  }
}

export { toAppliedAssumptions }
