import type { AppliedAssumptions } from '../../application/estimate/estimate-result.ts'

function toAppliedAssumptions(): AppliedAssumptions {
  return {
    nationalHeatingShares: {
      value:
        'energy of heating and hot water = territory consumption × national share (electricity 46.7%, natural gas 92.6%, fuel oil 100%, LPG 53.2%, heat 100%, 2024); the same consumption per square metre for every home using a given energy',
      source:
        'Functional documentation (p. 51): heating and hot water are the consumptions of the renovation lever; SDES, Consommation énergétique du secteur résidentiel (Conso_usage), 2024',
      limit:
        'The CEREN consumption per square metre by type, energy, period and département is not open: every territory is assumed to consume like France, and houses and flats, old and recent homes alike. Wood is absent from the territory data',
    },
    flatsAfter1971Excluded: {
      value: 'flats built after 1971 are not renovated in this estimate',
      source:
        'Functional documentation (pp. 53-54) and PlanET V1, Residentiel_Rénovation!B13: BBC rénovation level, 110 kWh of primary energy per m² per year, for flats built after 1971; 35% reduction for the other homes',
      limit:
        'The BBC level cannot be compared with average national consumptions in final energy without primary energy factors: the gain of recent flats is not counted, the total is underestimated',
    },
  }
}

export { toAppliedAssumptions }
