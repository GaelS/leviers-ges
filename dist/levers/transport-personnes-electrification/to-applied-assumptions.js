import { toRailShareAssumption } from "../../application/data/transport-personnes/to-rail-share-assumption.js";
import { FLEET_SOURCE } from "../../application/data/transport-personnes/fleet-source.js";
import { ELECTRIC_BUS_EMISSION_FACTOR, ELECTRIC_CAR_EMISSION_FACTOR, } from "../../domain/emission-factors.js";
import { calculateElectrifiedBusShare, calculateElectrifiedCarShare, } from "./calculate-transport-personnes-electrification-reduction.js";
function toElectricCarEmissionFactorAssumption() {
    return {
        electricCarEmissionFactor: {
            value: ELECTRIC_CAR_EMISSION_FACTOR.toFixed(),
            source: 'Fiche d’analyse 11, calcul d’essai OMINEA v23.1, en kgCO2e par véhicule.km : électricité amont uniquement, aucune émission à l’échappement',
            limit: 'Toute voiture électrifiée est comptée au même facteur, quel que soit le mix électrique du territoire',
        },
    };
}
function toElectricBusEmissionFactorAssumption() {
    return {
        electricBusEmissionFactor: {
            value: ELECTRIC_BUS_EMISSION_FACTOR.toFixed(),
            source: 'Base Empreinte, 0,0095 kgCO2e par passager.km, multiplié par les 10 passagers du taux d’occupation, en kgCO2e par véhicule.km : électricité amont uniquement, aucune émission à l’échappement',
            limit: 'Tout bus ou car électrifié est compté au même facteur, quel que soit le mix électrique du territoire',
        },
    };
}
function toCapLimit({ thermalShare, mode }) {
    return thermalShare.isZero()
        ? `Le territoire n’a pas de ${mode} thermiques dans les données du parc, faute d’immatriculation ou parce que le parc est entièrement électrique : rien ne peut être électrifié`
        : `La part demandée dépasse la part de ${mode} thermiques du parc : seule la part thermique peut être électrifiée, la part demandée est plafonnée`;
}
function toCarElectrificationCapAssumption({ fractions, thermalFleet, }) {
    const electrifiedShare = calculateElectrifiedCarShare({ fractions, thermalFleet });
    if (electrifiedShare.isEqualTo(fractions.carElectrification))
        return {};
    return {
        carElectrificationFraction: {
            value: electrifiedShare.toFixed(),
            source: `${FLEET_SOURCE}, part des voitures roulant à l’essence, au diesel ou au gaz`,
            limit: toCapLimit({ thermalShare: thermalFleet.carThermalFleetShare, mode: 'voitures' }),
        },
    };
}
function toBusElectrificationCapAssumption({ fractions, thermalFleet, }) {
    const electrifiedShare = calculateElectrifiedBusShare({ fractions, thermalFleet });
    if (electrifiedShare.isEqualTo(fractions.busElectrification))
        return {};
    return {
        busElectrificationFraction: {
            value: electrifiedShare.toFixed(),
            source: `${FLEET_SOURCE}, part des bus et cars roulant au diesel ou au gaz`,
            limit: toCapLimit({
                thermalShare: thermalFleet.busThermalFleetShare,
                mode: 'bus et cars',
            }),
        },
    };
}
function toAppliedAssumptions({ fractions, thermalFleet, railShare, }) {
    return {
        ...toElectricCarEmissionFactorAssumption(),
        ...toElectricBusEmissionFactorAssumption(),
        ...toRailShareAssumption(railShare),
        ...toCarElectrificationCapAssumption({ fractions, thermalFleet }),
        ...toBusElectrificationCapAssumption({ fractions, thermalFleet }),
    };
}
export { toAppliedAssumptions };
//# sourceMappingURL=to-applied-assumptions.js.map