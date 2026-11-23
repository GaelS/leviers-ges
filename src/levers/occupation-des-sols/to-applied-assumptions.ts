import type {
  AppliedAssumption,
  AppliedAssumptions,
} from '../../application/estimate/estimate-result.ts'
import type { Level } from '../../domain/territory.ts'

// Source : choix de conception de ce dépôt, non validé : la documentation fonctionnelle (p. 74) parle de la « zone pédoclimatique majoritaire du territoire » sans dire comment agréger, et ALDO ne publie pas de facteurs par zone
const TERRITORY_FACTORS_ASSUMPTION: AppliedAssumption = {
  value:
    'conversion factors are the mean of the communes factors, weighted by the area of the starting land type (each grassland type, cropland, sealed artificial land)',
  source:
    'Functional documentation (p. 74): the pedoclimatic zone of the territory is taken into account, a single majority zone; ALDO Flux 2 publishes factors by EPCI and by commune only',
  limit:
    'Design choice, not validated: ALDO factors vary within a pedoclimatic zone and the larger the territory the coarser a single value is (documentation, p. 75); a territory without the starting land type takes the plain mean of its communes',
}

function toAppliedAssumptions(level: Level): AppliedAssumptions {
  return {
    ...(level === 'epci' ? {} : { territoryFactors: TERRITORY_FACTORS_ASSUMPTION }),
    grasslandTypes: {
      value: 'wooded, herbaceous and shrub grassland, weighted by their area',
      source:
        'ALDO distinguishes three grassland types where the functional documentation (p. 74) names one, grassland; PlanET V1, COS!B15: choices made in proportion to existing areas',
      limit:
        'Design choice, not validated: afforestation and wetland development are spread over all grassland types by area. Artificial grass areas are read as the ALDO artificial shrub areas',
    },
    zeroReferenceArea: {
      value: 'a term whose reference area is zero stores nothing',
      source:
        'Design choice, not validated: the spreadsheet does not say what to do when an EPCI has no grassland, forest, grassland and cropland, or artificial wooded and grass areas',
      limit:
        'An EPCI without forest or without grassland gets 0 from the afforestation term, without grassland and cropland 0 from the wetland term, without artificial wooded and grass areas 0 from the desealing term, whatever rate is asked',
    },
    desealingWithoutHorizon: {
      value: 'the desealing term is not multiplied by the time horizon',
      source:
        'Functional documentation, equation 27 (p. 74): the desealing conversion factor is in tCO2e per hectare, the other two in tCO2e per hectare per year; answer of the CGDD, question 2',
      limit:
        'ALDO Flux 2 gives one value per conversion for the three terms; the spreadsheet reads it as an annual flow for afforestation and wetlands and as a one-off change for desealing',
    },
  }
}

export { toAppliedAssumptions }
