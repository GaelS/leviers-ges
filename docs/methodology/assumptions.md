# Registre des hypothèses

Une question ouverte devient une hypothèse nommée, avec sa valeur de contournement. Une réponse de l'ADEME change la valeur par défaut, pas le code. Chaque levier concerné accepte l'hypothèse dans le champ `assumptions` de sa requête et renvoie dans `appliedAssumptions` la valeur réellement utilisée.

## Hypothèses nommées

| Nom | Question | Défaut | Leviers concernés |
|---|---|---|---|
| `nitrogenCampaigns` | L'azote livré par département porte-t-il sur 2023 (tableur) ou sur deux campagnes ? Une moyenne sur deux ans vaut-elle aussi pour la région ? | département : campagne 2021-2022 seule ; région : moyenne 2021-2022 et 2022-2023 | `fertilisation_azotee` |
| `methanisationFactors` | Quels facteurs pour la méthanisation ? Les documents cités n'en donnent que pour lisier, fumier et pâture | OMINEA 2026 (CITEPA) : FCM 2,27 %, FD 0,0006 kg N-N2O/kg N excrété, pour bovins et porcins ; indisponible pour les autres animaux | `elevage_durable` |
| `railElectricityUpstreamShare` | Quelle part du poste amont de l'électricité du transport ferré compter ? | tout l'amont, sans la fabrication : Base Empreinte, TER 2022, amont 0,0229 kgCO2e/passager.km (fabrication 0,00479 non comptée) ; Corse 0,187 | transport de personnes : sobriété des déplacements, report modal |
| `electricVehicleEmissionFactors` | Quelle ligne de la Base Empreinte pour les facteurs électriques ? | l'amont seul, sans la fabrication : voiture électrique compacte 2021, 0,0133 kgCO2e/km (élément 28007) ; bus électrique, 0,0095 kgCO2e/passager.km | transport de personnes : électrification |
| `heavyVehicleLoadFactor` | Quelle valeur « SNBC 3 » du taux de chargement des poids lourds ? | 8,1 t (guide SGPE du 16/02/2024, p. 37 ; 8,1 t en 2019, 8,7 t en cible 2030) | transport de marchandises : les quatre leviers |
| `wasteScope` | Les tonnes de déchets sont-elles celles collectées sur le territoire (`A25`) ou celles des sites de traitement présents sur le territoire (`L21`) ? | les sites : registre IREP 2022 de Géorisques (déchets non dangereux du chapitre 20), rattachés au territoire par la commune du site ; facteurs de la feuille `FE_déchets` du tableur | `dechets_mode_de_traitement`, `dechets_sobriete` |
| `passengerCarLastLineKept` | La dernière ligne de la formule du report modal des voitures est-elle à garder ? Elle reprend un terme déjà dans l'accolade et compterait deux fois le report vers les modes actifs | ligne ignorée | transport de personnes : report modal |
| `heavyVehicleTripType` | Trajet de poids lourds en courte ou en longue distance, et quelle maille de parc ? | longue distance, parc de la région : OMINEA 2024, poids lourds diesel, 645,1 g CO2/véhicule.km ÷ 8,1 t, soit 0,0796 kgCO2e/t.km (0,1055 en courte distance, +32 %) ; parc au 1er janvier 2024 (RSVERO, SDES) | transport de marchandises : les quatre leviers |
| `includeInternationalFlows` | Les flux avec l'étranger comptent-ils dans les tonnes-kilomètres rapportées à la région ? | avec l'étranger : trafic interne + 50 % du trafic chargé ou déchargé dans la région (SDES, jeu `reg_type_flux`, 2024) ; de +18 % (Corse) à +62 % (Hauts-de-France) | transport de marchandises : les quatre leviers |

## Questions sans contournement, hors périmètre

Ces quatre questions bloquent le calcul. Les leviers concernés n'ont aucune variante de `Request` et leurs trois niveaux sont `not_computed`.

| Levier | Ce qui manque | Pourquoi aucun contournement |
|---|---|---|
| Changement d'occupation des sols | l'unité du facteur de conversion : par an (tCO2e/ha/an, comme le tableur) ou variation totale (tCO2e/ha, comme ALDO) | le résultat varie jusqu'à 20 fois et change d'unité |
| Résidentiel, rénovation | la consommation par m² des logements avant rénovation, par type de logement, chauffage et période de construction, par département (le tableur la renvoie au CEREN, « Pas disponible en open source ») | le fichier national gratuit n'a pas le chauffage principal |
| Résidentiel, changement du système de chauffage | l'énergie livrée au seul chauffage, par département et par énergie | les données ouvertes du SDES couvrent tous les usages |
| Résidentiel, changement du système de chauffage | les rendements du GPL et des pompes à chaleur | la page citée ne donne pas le rendement du GPL ; le tableau CSTB-ADEME des pompes à chaleur est inaccessible (lien mort) |

Pratiques stockantes est aussi `not_computed` aux trois niveaux, pour une autre raison : son périmètre de validité est « LIMITEE » à chaque maille, sans commentaire ni surface applicable.

## Règle d'usage

| Règle | Détail |
|---|---|
| Valeur par défaut | définie une fois, dans le module du levier, avec son commentaire `Source :` |
| Valeur transmise | validée par `zod` ; le type de `Request` du levier ne porte que les hypothèses de ce levier |
| Traçabilité | `appliedAssumptions` du résultat contient la valeur utilisée, même quand c'est le défaut |
| Réponse reçue | on change la valeur par défaut et la source citée ; la ligne du registre passe en « résolue » avec la date |
