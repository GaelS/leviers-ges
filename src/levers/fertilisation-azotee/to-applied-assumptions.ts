import type { AppliedAssumptions } from '../../application/estimate/estimate-result.ts'
import { NITROGEN_SPREADING_EMISSION_FACTOR } from './calculate-fertilisation-azotee-reduction.ts'

function toAppliedAssumptions(): AppliedAssumptions {
  return {
    nitrogenCampaigns: {
      value: 'average of the 2022-2023 (revised) and 2023-2024 campaigns',
      source:
        'DonneesTerritoires!D8: take the average over two years; UNIFA, deliveries of the 2023-2024 campaign by region and by département, the 2022-2023 campaign being revised by the published evolution',
      limit:
        'Deliveries are counted where the distributor is, not where the nitrogen is spread, a limit the spreadsheet assumes (ChgtPratiques!B13). Two campaigns only; the 2022-2023 value is derived from a published evolution rounded to 0.1 %',
    },
    nitrogenSpreadingEmissionFactor: {
      value: NITROGEN_SPREADING_EMISSION_FACTOR.toFixed(),
      source: 'Base Empreinte, element 24270, mineral nitrogen fertiliser spread, kgCO2e per kg of nitrogen',
      limit:
        'Uncertainty of 400% in the Base Empreinte; one national value for continental France, applied to every territory including Corsica',
    },
  }
}

export { toAppliedAssumptions }
