import type { AppliedAssumptions } from '../../application/estimate/estimate-result.ts'
import { NITROGEN_SPREADING_EMISSION_FACTOR } from './calculate-fertilisation-azotee-reduction.ts'
import type { NitrogenDelivered } from './data/nitrogen-delivered.ts'

function toCampaignsAssumption({ campaigns }: NitrogenDelivered): AppliedAssumptions['nitrogenCampaigns'] {
  if (campaigns === 'two-year-average') {
    return {
      value: 'average of the 2021-2022 and 2022-2023 campaigns',
      source:
        'DonneesTerritoires!D8: take the average over two years; UNIFA and France Fertilisants, deliveries by region',
      limit:
        'Deliveries are counted where the distributor is, not where the nitrogen is spread, a limit the spreadsheet assumes (ChgtPratiques!B13). Two campaigns only',
    }
  }
  return {
    value: '2021-2022 campaign only',
    source:
      'UNIFA, deliveries of the 2021-2022 campaign by département: the only départemental report available, the spreadsheet asks for a two-year average (DonneesTerritoires!D8)',
    limit:
      'Deliveries move between campaigns (Nouvelle-Aquitaine 229,342 t in 2021-2022 then 200,843 t in 2022-2023) and are counted where the distributor is, not where the nitrogen is spread: Paris receives 17,415 t for 1 ha of agricultural land',
  }
}

function toAppliedAssumptions(delivered: NitrogenDelivered): AppliedAssumptions {
  return {
    nitrogenCampaigns: toCampaignsAssumption(delivered),
    nitrogenSpreadingEmissionFactor: {
      value: NITROGEN_SPREADING_EMISSION_FACTOR.toFixed(),
      source: 'Base Empreinte, element 24270, mineral nitrogen fertiliser spread, kgCO2e per kg of nitrogen',
      limit:
        'Uncertainty of 400% in the Base Empreinte; one national value for continental France, applied to every territory including Corsica',
    },
  }
}

export { toAppliedAssumptions }
