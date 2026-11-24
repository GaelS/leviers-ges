import { toBig } from "../../domain/big-number.js";
// Source : Secten 2026 du Citepa (PRG AR5), page 34 du PDF Citepa_Secten-2026.pdf : 28 kgCO2e par kg de méthane
const METHANE_GLOBAL_WARMING_POTENTIAL = toBig('28');
// Source : Secten 2026 du Citepa (PRG AR5), page 34 du PDF Citepa_Secten-2026.pdf : 265 kgCO2e par kg de protoxyde d'azote
const NITROUS_OXIDE_GLOBAL_WARMING_POTENTIAL = toBig('265');
// Source : DonneesReference!D11 et Base Carbone, Agriculture - cheptels : FE des déjections = SV × 365 jours par an × Bo × 0,67 kg par m3 de méthane
const DAYS_PER_YEAR = toBig('365');
// Source : DonneesReference!D11 et Base Carbone, Agriculture - cheptels : masse volumique du méthane de 0,67 kg par m3
const METHANE_DENSITY_KG_PER_CUBIC_METRE = toBig('0.67');
// Source : DonneesReference!D13 et Base Carbone, Agriculture - cheptels : Fex × 44/28 convertit l'azote de N-N2O en N2O ; masse molaire du N2O
const NITROUS_OXIDE_MOLAR_MASS = toBig('44');
// Source : DonneesReference!D13 et Base Carbone, Agriculture - cheptels : Fex × 44/28 ; masse molaire de l'azote de N2 dans le N2O
const NITROGEN_MOLAR_MASS_IN_NITROUS_OXIDE = toBig('28');
// Source : Base Carbone, Agriculture - cheptels, valeurs par défaut du GIEC : 0,1 % de l'azote excrété en lisier devient du N-N2O
const LIQUID_MANURE_NITROUS_OXIDE_FACTOR = toBig('0.001');
// Source : Base Carbone, Agriculture - cheptels, valeurs par défaut du GIEC : 2 % de l'azote excrété en fumier devient du N-N2O
const SOLID_MANURE_NITROUS_OXIDE_FACTOR = toBig('0.02');
// Source : Base Carbone, Agriculture - cheptels, valeurs par défaut du GIEC : 2 % de l'azote excrété à la pâture devient du N-N2O
const PASTURE_NITROUS_OXIDE_FACTOR = toBig('0.02');
// Source : hypothèse nommée methanisationFactors (docs/methodology/assumptions.md), OMINEA 2026 du CITEPA : FCM de la méthanisation de 2,27 %, bovins et porcins seulement
const DIGESTION_METHANE_CONVERSION_FACTOR = toBig('0.0227');
// Source : hypothèse nommée methanisationFactors (docs/methodology/assumptions.md), OMINEA 2026 du CITEPA : FD de la méthanisation de 0,0006 kg de N-N2O par kg d'azote excrété, bovins et porcins seulement
const DIGESTION_NITROUS_OXIDE_FACTOR = toBig('0.0006');
// Source : OMINEA 2013 (FCM « NA ») et OMINEA 2026 : un mode de gestion sans facteur pour un animal ne contribue pas aux émissions (choix de conception, non validé)
const NO_CONVERSION_CONTRIBUTION = toBig('0');
// Source : ElevageDurable!B15 : « La part initiale de méthanisation est considérée à 0 »
const INITIAL_DIGESTION_SHARE = toBig('0');
// Source : élément neutre de la multiplication, pour les termes « 1 − % » de la formule
const ONE = toBig('1');
export { DAYS_PER_YEAR, DIGESTION_METHANE_CONVERSION_FACTOR, DIGESTION_NITROUS_OXIDE_FACTOR, INITIAL_DIGESTION_SHARE, LIQUID_MANURE_NITROUS_OXIDE_FACTOR, METHANE_DENSITY_KG_PER_CUBIC_METRE, METHANE_GLOBAL_WARMING_POTENTIAL, NITROGEN_MOLAR_MASS_IN_NITROUS_OXIDE, NITROUS_OXIDE_GLOBAL_WARMING_POTENTIAL, NITROUS_OXIDE_MOLAR_MASS, NO_CONVERSION_CONTRIBUTION, ONE, PASTURE_NITROUS_OXIDE_FACTOR, SOLID_MANURE_NITROUS_OXIDE_FACTOR, };
//# sourceMappingURL=emission-constants.js.map