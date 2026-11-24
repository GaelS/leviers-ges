import { toGoodsTransportAssumptions } from "../../application/data/transport-marchandises/to-goods-transport-assumptions.js";
import { ECODRIVING_POTENTIAL } from "./calculate-transport-marchandises-efficacite-reduction.js";
function toEcodrivingAssumption() {
    return {
        ecodrivingPotential: {
            value: ECODRIVING_POTENTIAL.toFixed(),
            source: 'Documentation fonctionnelle (juin 2026), 7.3.9, p. 66 : le potentiel des poids lourds est celui du transport de personnes, 10 % par défaut (7.3.4.3, p. 61) ; la documentation écrit aussi 15 % p. 66, tranché par l’équipe le 19/11/2026 en faveur de 10 % ; le tableur donne environ 15 % (DonneesReference!D29)',
            limit: 'Le guide ADEME EVE pour le transport de marchandises donne 5 à 15 % (10 % en moyenne), s’estompant à environ 3 % sur trois ans ; un seul potentiel pour tous les poids lourds alors que le guide distingue les activités',
        },
    };
}
function toAppliedAssumptions(goodsTransport) {
    return { ...toGoodsTransportAssumptions(goodsTransport), ...toEcodrivingAssumption() };
}
export { toAppliedAssumptions };
//# sourceMappingURL=to-applied-assumptions.js.map