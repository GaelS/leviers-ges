import { match } from 'ts-pattern';
// Source : compound-knowledge-db, docs/plans/2026-09-21-001-feat-leviers-ges/onglets/00-questions-implementation.md,
// section 1 « Tableau par levier et par maille » (2026-10-07) : 16 no_open_question, 24 workaround, 23 not_computed ;
// état au 2026-11-23, après les niveaux calculés depuis : 17 no_open_question, 37 workaround, 9 not_computed
const LEVERS = {
    fertilisation_azotee: { region: 'workaround', departement: 'workaround', epci: 'workaround' },
    elevage_durable: { region: 'workaround', departement: 'workaround', epci: 'not_computed' },
    batiments_machines_agricoles: {
        region: 'no_open_question',
        departement: 'no_open_question',
        epci: 'no_open_question',
    },
    haies: { region: 'no_open_question', departement: 'no_open_question', epci: 'no_open_question' },
    pratiques_stockantes: { region: 'workaround', departement: 'workaround', epci: 'workaround' },
    occupation_des_sols: { region: 'workaround', departement: 'workaround', epci: 'workaround' },
    produits_bois: {
        region: 'no_open_question',
        departement: 'no_open_question',
        epci: 'no_open_question',
    },
    residentiel_renovation: { region: 'workaround', departement: 'workaround', epci: 'workaround' },
    residentiel_changement_systeme_chauffage: {
        region: 'workaround',
        departement: 'workaround',
        epci: 'workaround',
    },
    residentiel_sobriete: {
        region: 'no_open_question',
        departement: 'no_open_question',
        epci: 'workaround',
    },
    transport_personnes_sobriete_deplacements: {
        region: 'workaround',
        departement: 'workaround',
        epci: 'workaround',
    },
    transport_personnes_report_modal: {
        region: 'workaround',
        departement: 'workaround',
        epci: 'workaround',
    },
    transport_personnes_efficacite: {
        region: 'no_open_question',
        departement: 'no_open_question',
        epci: 'no_open_question',
    },
    transport_personnes_electrification: {
        region: 'workaround',
        departement: 'workaround',
        epci: 'workaround',
    },
    transport_marchandises_sobriete_logistique: {
        region: 'workaround',
        departement: 'not_computed',
        epci: 'not_computed',
    },
    transport_marchandises_report_modal: {
        region: 'workaround',
        departement: 'not_computed',
        epci: 'not_computed',
    },
    transport_marchandises_efficacite: {
        region: 'workaround',
        departement: 'not_computed',
        epci: 'not_computed',
    },
    transport_marchandises_electrification: {
        region: 'workaround',
        departement: 'not_computed',
        epci: 'not_computed',
    },
    dechets_mode_de_traitement: { region: 'workaround', departement: 'workaround', epci: 'workaround' },
    dechets_sobriete: { region: 'workaround', departement: 'workaround', epci: 'workaround' },
    reseaux_chaleur: {
        region: 'no_open_question',
        departement: 'no_open_question',
        epci: 'no_open_question',
    },
};
function getStatus({ lever, level }) {
    return LEVERS[lever][level];
}
function isComputed(status) {
    return match(status)
        .with('no_open_question', 'workaround', () => true)
        .with('not_computed', () => false)
        .exhaustive();
}
function isComputedLevel(lever, level) {
    return isComputed(getStatus({ lever, level }));
}
export { getStatus, isComputed, isComputedLevel, LEVERS };
//# sourceMappingURL=lever-registry.js.map