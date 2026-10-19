import type { AppliedAssumptions } from '../../estimate/estimate-result.ts'
import type { RailEmissionFactor } from './rail-emission-factor.ts'

function toRailEmissionFactorAssumption(railEmissionFactor: RailEmissionFactor): AppliedAssumptions {
  return {
    railEmissionFactor: {
      value: railEmissionFactor.emissionFactor.toFixed(),
      source: railEmissionFactor.isCorsican
        ? 'Base Empreinte, Corsican passenger train, in kgCO2e per passenger-km. Design choice, not validated: only a territory entirely in Corsica takes it, one straddling Corsica and another region takes the mainland factor'
        : 'Base Empreinte, TER average 2022, upstream electricity only (manufacturing 0.00479 not counted), in kgCO2e per passenger-km. Design choice, not validated',
      limit:
        'One value for all rail (metro, tram, train): a territory with a metro or tram network has its own, usually lower, factor',
    },
  }
}

export { toRailEmissionFactorAssumption }
