import { ELECTRIC_HEAVY_VEHICLE_EMISSION_FACTOR, HEAVY_VEHICLE_LOADING_RATE } from '../../../domain/heavy-vehicle-emission-factor.ts'
import type { AppliedAssumptions } from '../../estimate/estimate-result.ts'
import type { GoodsTransport } from './get-goods-transport.ts'

// Source : choix de conception, non validé : précision d'affichage des facteurs renvoyés dans appliedAssumptions
const DISPLAYED_DECIMAL_PLACES = 6

function toFlowsAssumption(): AppliedAssumptions {
  return {
    includeInternationalFlows: {
      value: 'internal flows plus 50% of the flows loaded or unloaded in the region, abroad included',
      source:
        'DonneesTerritoires!D17; SDES, Le TRM des pavillons européens en 2024, sheet reg_type_flux',
      limit:
        'Without the international flows the 13 regions drop from 239.97 to 171.71 billion tonne-km; with them a region has from 18% (Corsica) to 62% (Hauts-de-France) more tonne-km',
    },
  }
}

function toEmissionFactorAssumptions({ inputs, emissionFactors }: GoodsTransport): AppliedAssumptions {
  return {
    heavyVehicleTripType: {
      value: 'long distance, diesel heavy vehicles of the region',
      source:
        "OMINEA 2024 (CITEPA), CO2 of diesel heavy vehicles, long distance: 50% SNAP 070301PL and 50% 070302PL, Euro standard chosen by Crit'Air (FE_transports), weighted by the region's fleet, divided by the loading rate",
      limit:
        'Short distance (070302PL and 070303PL) is 32% higher. CO2 only: CH4 and N2O would add about 1.7%. The fleet is the one registered in the region, not the one that drives there',
    },
    heavyVehicleThermalEmissionFactor: {
      value: emissionFactors.thermal.decimalPlaces(DISPLAYED_DECIMAL_PLACES).toFixed(),
      source:
        "OMINEA 2024 (CITEPA) diesel CO2 per vehicle-km of the region's fleet, divided by the loading rate, in kgCO2e per tonne-km",
      limit: 'Applied to the share of the fleet that is not zero-emission; the rest takes the electric factor',
    },
    heavyVehicleLoadFactor: {
      value: HEAVY_VEHICLE_LOADING_RATE.toFixed(),
      source:
        'SGPE, Panorama des leviers, 2024-02-16, p. 37: average filling rate of heavy vehicles from 8.1 t to 8.7 t (DonneesReference!D43 asks for the SNBC 3 value without giving it)',
      limit: '8.1 t is the 2019 value, 8.7 t the 2030 target',
    },
    dieselUnclassifiedShare: {
      value: inputs.dieselUnclassifiedShare.toFixed(),
      source: 'SDES, Parc de véhicules routiers (RSVERO) at 1 January 2024, heavy vehicles of the region',
      limit:
        "This share of the region's diesel heavy vehicles has no Crit'Air 1 to 5 vignette and is left out of the diesel average",
    },
    electricHeavyVehicleEmissionFactor: {
      value: ELECTRIC_HEAVY_VEHICLE_EMISSION_FACTOR.toFixed(),
      source: 'Base Empreinte, element 28030 (rigid 3.5 to 7.5 t, electric), upstream only',
      limit:
        'One electric factor for every heavy vehicle, including those over 7.5 t; hydrogen is treated as electric; validity April 2021, uncertainty 70%',
    },
  }
}

function toGoodsTransportAssumptions(goodsTransport: GoodsTransport): AppliedAssumptions {
  return { ...toFlowsAssumption(), ...toEmissionFactorAssumptions(goodsTransport) }
}

export { DISPLAYED_DECIMAL_PLACES, toGoodsTransportAssumptions }
