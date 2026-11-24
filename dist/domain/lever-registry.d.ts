import type { Level } from './territory.ts';
type Status = 'no_open_question' | 'workaround' | 'not_computed';
type ComputedStatus = Exclude<Status, 'not_computed'>;
declare const LEVERS: {
    readonly fertilisation_azotee: {
        readonly region: "workaround";
        readonly departement: "workaround";
        readonly epci: "workaround";
    };
    readonly elevage_durable: {
        readonly region: "workaround";
        readonly departement: "workaround";
        readonly epci: "not_computed";
    };
    readonly batiments_machines_agricoles: {
        readonly region: "no_open_question";
        readonly departement: "no_open_question";
        readonly epci: "no_open_question";
    };
    readonly haies: {
        readonly region: "no_open_question";
        readonly departement: "no_open_question";
        readonly epci: "no_open_question";
    };
    readonly pratiques_stockantes: {
        readonly region: "workaround";
        readonly departement: "workaround";
        readonly epci: "workaround";
    };
    readonly occupation_des_sols: {
        readonly region: "workaround";
        readonly departement: "workaround";
        readonly epci: "workaround";
    };
    readonly produits_bois: {
        readonly region: "no_open_question";
        readonly departement: "no_open_question";
        readonly epci: "no_open_question";
    };
    readonly residentiel_renovation: {
        readonly region: "workaround";
        readonly departement: "workaround";
        readonly epci: "workaround";
    };
    readonly residentiel_changement_systeme_chauffage: {
        readonly region: "workaround";
        readonly departement: "workaround";
        readonly epci: "workaround";
    };
    readonly residentiel_sobriete: {
        readonly region: "no_open_question";
        readonly departement: "no_open_question";
        readonly epci: "workaround";
    };
    readonly transport_personnes_sobriete_deplacements: {
        readonly region: "workaround";
        readonly departement: "workaround";
        readonly epci: "workaround";
    };
    readonly transport_personnes_report_modal: {
        readonly region: "workaround";
        readonly departement: "workaround";
        readonly epci: "workaround";
    };
    readonly transport_personnes_efficacite: {
        readonly region: "no_open_question";
        readonly departement: "no_open_question";
        readonly epci: "no_open_question";
    };
    readonly transport_personnes_electrification: {
        readonly region: "workaround";
        readonly departement: "workaround";
        readonly epci: "workaround";
    };
    readonly transport_marchandises_sobriete_logistique: {
        readonly region: "workaround";
        readonly departement: "not_computed";
        readonly epci: "not_computed";
    };
    readonly transport_marchandises_report_modal: {
        readonly region: "workaround";
        readonly departement: "not_computed";
        readonly epci: "not_computed";
    };
    readonly transport_marchandises_efficacite: {
        readonly region: "workaround";
        readonly departement: "not_computed";
        readonly epci: "not_computed";
    };
    readonly transport_marchandises_electrification: {
        readonly region: "workaround";
        readonly departement: "not_computed";
        readonly epci: "not_computed";
    };
    readonly dechets_mode_de_traitement: {
        readonly region: "workaround";
        readonly departement: "workaround";
        readonly epci: "workaround";
    };
    readonly dechets_sobriete: {
        readonly region: "workaround";
        readonly departement: "workaround";
        readonly epci: "workaround";
    };
    readonly reseaux_chaleur: {
        readonly region: "no_open_question";
        readonly departement: "no_open_question";
        readonly epci: "no_open_question";
    };
};
type LeverId = keyof typeof LEVERS;
type ComputedLevels<L extends LeverId> = {
    [K in Level]: (typeof LEVERS)[L][K] extends 'not_computed' ? never : K;
}[Level];
declare function getStatus({ lever, level }: {
    lever: LeverId;
    level: Level;
}): Status;
declare function isComputed(status: Status): boolean;
declare function isComputedLevel<L extends LeverId>(lever: L, level: Level): level is ComputedLevels<L>;
export { getStatus, isComputed, isComputedLevel, LEVERS };
export type { ComputedLevels, ComputedStatus, LeverId, Status };
