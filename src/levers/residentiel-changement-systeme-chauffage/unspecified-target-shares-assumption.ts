import type { AppliedAssumption } from '../../application/estimate/estimate-result.ts'

// Source : choix de conception de ce dépôt, non validé : la documentation fonctionnelle (p. 55) donne le mix actuel par défaut des parts cibles sans dire comment répartir ce qui reste quand une part est modifiée ; PlanET V1, Residentiel_ChgtSyst!B15 : la somme des parts cibles vaut 100 %
const UNSPECIFIED_TARGET_SHARES_ASSUMPTION: AppliedAssumption = {
  value:
    'an unspecified target share keeps its current proportion of the useful energy among the unspecified shares, which share what the given shares leave; a single unspecified share takes all that is left',
  source:
    'Functional documentation (p. 55): the current mix is the default of the target shares; PlanET V1, Residentiel_ChgtSyst!B15: changing the share of one system changes the shares of the others',
  limit:
    'Design choice, not validated: the documentation does not say how the other shares move. The current mix is estimated from the national shares of heating and hot water, wood being 0',
}

export { UNSPECIFIED_TARGET_SHARES_ASSUMPTION }
