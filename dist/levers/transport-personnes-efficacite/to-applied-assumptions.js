import { toBusEmissionFactorAssumption, toBusFleetUnclassifiedAssumption, toCarFleetUnclassifiedAssumption, toNationalBusAssumption, toNationalCarAssumption, } from "../../application/data/transport-personnes/to-fleet-assumptions.js";
import { ECODRIVING_POTENTIAL } from "./calculate-transport-personnes-efficacite-reduction.js";
import { toRailShareAssumption } from "../../application/data/transport-personnes/to-rail-share-assumption.js";
function toEcodrivingPotentialAssumption() {
    return {
        ecodrivingPotential: {
            value: ECODRIVING_POTENTIAL.toFixed(),
            source: 'Documentation fonctionnelle (juin 2026), 7.3.4.3, p. 61 : le potentiel est le même pour les transports en commun routiers et les voitures, 10 % par défaut (enquête IPSOS) ; le tableur donne environ 15 % (DonneesReference!D29), la documentation prévaut ; confirmé par l’équipe le 19/11/2026',
            limit: 'Un potentiel moyen unique pour les voitures et pour les bus : le résultat lui est proportionnel. La documentation indique un maximum de 23 % de carburant pour une citadine essence et environ la moitié des gestes d’écoconduite déjà appliqués',
        },
    };
}
function toAppliedAssumptions({ transportInputs, railShare, }) {
    return {
        ...toEcodrivingPotentialAssumption(),
        ...toBusEmissionFactorAssumption(transportInputs),
        ...toRailShareAssumption(railShare),
        ...toCarFleetUnclassifiedAssumption(transportInputs),
        ...toBusFleetUnclassifiedAssumption(transportInputs),
        ...toNationalCarAssumption(transportInputs),
        ...toNationalBusAssumption(transportInputs),
    };
}
export { toAppliedAssumptions };
//# sourceMappingURL=to-applied-assumptions.js.map