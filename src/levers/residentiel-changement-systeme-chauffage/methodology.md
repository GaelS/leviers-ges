# Résidentiel, changement du système de chauffage

Identifiant : `residentiel_changement_systeme_chauffage`. Niveaux : région, département et EPCI, tous `workaround`. Le levier est une approximation : l'énergie de chauffage par territoire (CEREN, non ouvert) est remplacée par une part nationale du CEREN (choix 1). Seuls les vecteurs dont le rendement est sourcé sont calculés : le GPL n'est ni source ni cible (choix 5). Métropole seule, comme `residentiel_sobriete`.

## Formule

```
E_v  = C_v × part_chauffage_ECS_v              énergie finale actuelle de chauffage et d'ECS
U    = Σ_v E_v × η_ancien_v                    énergie utile, conservée
E'_v = U × s'_v ÷ η_rénové_v                   énergie finale cible
Émissions évitées (tCO2e/an) = Σ_v (E_v − E'_v) × FE_v

v : électricité (PAC comprises), gaz naturel, fioul domestique, bois, chaleur commercialisée
```

| Terme | Sens | Unité |
|---|---|---|
| `C_v` | consommation résidentielle du vecteur, tous usages, lue comme dans `residentiel_sobriete` | MWh |
| `part_chauffage_ECS_v` | part nationale du chauffage et de l'eau chaude sanitaire dans cette consommation (CEREN 2024, climat normal) ; la documentation (p. 51) range les deux usages sous les leviers Rénovation et Changement de système | fraction |
| `s'_v` | part cible du vecteur dans l'énergie utile, saisie ou, si elle n'est pas précisée, déduite (choix 6) ; les cinq font 100 % | fraction |
| `η` | rendement global de l'installation (ADEME, p. 156) | fraction |
| `FE_v` | facteur d'émission du vecteur ; la chaleur : moyenne pondérée des réseaux du territoire | kgCO2e/kWh |

La cellule « Formule » du tableur est vide (« Réduction GES = ») : la formule est lue dans ses commentaires (`Residentiel_ChgtSyst!B13` : l'énergie livrée est « rapportée à une quantité d'énergie utile par multiplication par l'efficacité énergétique » ; `B15` : le levier ne modifie pas l'énergie utile totale, la part d'un système modifie celle des autres).

## Entrées

| Entrée | Unité | Bornes |
|---|---|---|
| `targetElectricityShareFraction` | fraction | 0 à 1 |
| `targetNaturalGasShareFraction` | fraction | 0 à 1 |
| `targetFuelOilShareFraction` | fraction | 0 à 1 |
| `targetWoodShareFraction` | fraction | 0 à 1 |
| `targetHeatNetworkShareFraction` | fraction | 0 à 1 |

Les cinq sont facultatives. Une part non précisée garde sa proportion actuelle de l'énergie utile : elle partage avec les autres parts non précisées ce que les parts données laissent, jusqu'à 100 % (choix 6). Sans aucune part, la cible est le mix actuel et seul le gain de rendement des appareils rénovés compte. Les parts données ne dépassent pas 100 % ; les cinq données font 100 %, sinon `invalid_request`. Une seule part non précisée prend tout le reste. Plusieurs parts non précisées dont l'usage actuel est nul (par exemple le bois et un réseau de chaleur absent) ne peuvent pas se partager un reste : `invalid_request`.

## Constantes

| Constante | Valeur | Source |
|---|---|---|
| Part du chauffage et de l'ECS, électricité | 41,2 % | CEREN, « Données sur l'énergie dans le résidentiel » (mise à jour du 20 décembre 2024), « Répartition en 2024 des consommations », climat normal, TWh entiers : (45 + 16) ÷ 148 |
| Part du chauffage et de l'ECS, gaz naturel | 87,9 % | (80 + 7) ÷ 99 |
| Part du chauffage et de l'ECS, fioul | 100 % | (29 + 3) ÷ 32 |
| Part du chauffage et de l'ECS, chaleur | 100 % | (13 + 1) ÷ 14 |
| Part du chauffage et de l'ECS, bois | 0 | documentation, pp. 52-53 (choix 3) ; le CEREN donne 73 TWh de bois, aucune consommation du territoire n'est disponible |
| Rendements actuels | gaz 75 %, fioul 75 %, bois 70 %, électricité 95 %, chaleur 1 | ADEME, Rénovation performante par étapes, p. 156 ; chaleur : `Residentiel_ChgtSyst` |
| Rendements cibles | gaz 90 %, fioul 90 %, bois 75 %, électricité 100 %, chaleur 1 | idem |
| FE électricité, gaz, fioul | comme `residentiel_sobriete` | `src/domain/emission-factors.ts` |
| FE bois | 0 | documentation, p. 52 : émissions comptées au prélèvement |

## Données

Aucun jeu propre : la consommation vient de `src/application/residential-consumption/` (jeux de `residentiel_sobriete` et du parc `residentiel-logements` à l'EPCI), la chaleur et son facteur des réseaux du territoire.

## Choix faits

| # | Choix | Source ou statut |
|---|---|---|
| 1 | Énergie de chauffage et d'ECS = consommation du territoire × part nationale du chauffage et de l'ECS par vecteur | les parts viennent du CEREN national (`Residentiel_ChgtSyst!G28` désigne le CEREN départemental, non ouvert) ; suppose le même usage partout ; chauffage et ECS : documentation, p. 51, et `Données_Parc_habitation!A6` (consommations « Renov ») ; la climatisation n'est pas comptée |
| 2 | Deux rendements par vecteur : ancien pour l'énergie actuelle, rénové pour la cible | interprétation nouvelle : le tableur n'en nomme qu'un (`B15`, « un seul coefficient ») et renvoie à la p. 156 qui donne les deux ; la documentation (p. 55) parle d'« appareils à meilleur rendement » |
| 3 | Bois : consommation de base 0, part cible acceptée, FE 0, rendement 75 % | limite reconnue par la documentation (pp. 52-53) ; 75 % est la plus basse des deux valeurs rénovées (75 %, 85 %), choix de conception, non validé |
| 4 | Pompes à chaleur confondues avec l'électricité, un seul rendement de 100 % à la cible | `Residentiel_ChgtSyst!B15` : « un seul coefficient utilisé » ; le tableau CSTB est inaccessible |
| 5 | GPL ni source ni cible, sa consommation n'est pas modifiée | aucune valeur de rendement du GPL dans la p. 156 ; on ne calcule que ce qui est sourcé |
| 6 | Une part cible non précisée vaut sa part actuelle de l'énergie utile, rapportée à ce que les parts données laissent ; le mix actuel est estimé avec les parts nationales (choix 1), le bois à 0 | la documentation (p. 55) donne le mix actuel par défaut sans dire comment répartir le reste ; `Residentiel_ChgtSyst!B15` : la somme vaut 100 % ; interprétation nouvelle, renvoyée dans `appliedAssumptions.unspecifiedTargetShares` |
| 7 | Territoire sans réseau : facteur de la chaleur nul | comme `residentiel_sobriete` (choix 15) ; un passage au réseau n'y coûte rien |
| 8 | Énergie utile nulle : 0 tCO2e évité | choix de conception, non validé |
| 9 | Année 2024 ; parts du chauffage à climat normal et en TWh entiers (CEREN), consommations du territoire à climat réel et en PCI (SDES) | choix de conception, non validé : les deux sources ne partagent ni le climat ni l'unité |

## Cas de test

| Entrée | Résultat |
|---|---|
| 1 000 MWh de fioul passent au gaz | 100,63 tCO2e |
| 1 000 MWh de fioul passent à l'électricité | 242,04 tCO2e |
| 1 000 MWh de fioul passent au bois | 268,27 tCO2e |
| 1 000 MWh de gaz restent au gaz (gain de rendement 75 % → 90 %) | 29,46 tCO2e |
| 1 000 MWh de gaz passent au fioul | −19,68 tCO2e |
| département 01, jeu de test, cible 50 % électricité, 10 % gaz, 0 % fioul, 10 % bois, 30 % réseau | 544,13 tCO2e |
| région 84, jeu de test, même cible | 4 462,45 tCO2e |
| département 35, données réelles, même cible | 239 822,28 tCO2e |
| département 35, aucune part précisée (mix actuel) | 64 518,05 tCO2e |
| département 35, fioul à 0 | 109 013,74 tCO2e |
| département 35, fioul à 0 et bois à 10 % | 143 321,86 tCO2e |
| somme des 13 régions | 18 676 566,08 tCO2e |
| somme des 96 départements | 18 952 822,9 tCO2e |
| somme des 1 232 EPCI | 20 179 470,96 tCO2e |

Les valeurs sont recalculées hors du dépôt (Python, `Decimal`) à partir des CSV et des constantes.

## Limites

| Limite | Effet |
|---|---|
| Part nationale du chauffage | un département qui chauffe moins ou plus que la moyenne nationale est mal estimé ; Ille-et-Vilaine : 4,41 TWh tous usages, dont une part chauffage et ECS qui baisse avec les parts CEREN (non rechiffrée) ; parts arrondies au TWh, climat normal et non réel |
| Bois | absent des données du territoire : un passage au bois supprime des émissions sans en retirer d'énergie du bois existant |
| GPL | 50 % de sa consommation sert au chauffage et à l'ECS ; il n'est pas modifiable |
| Territoire sans réseau de chaleur | facteur nul : un EPCI sans réseau qui vise du réseau de chaleur évite des émissions sans coût ; la somme des EPCI dépasse de 6,5 % celle des départements |
| Pompes à chaleur | la part de chauffage de l'électricité inclut les PAC, la cible est lue à 100 % : le gain d'une PAC (COP) n'est pas compté |
| Résultat négatif | une cible plus émettrice que l'actuel donne une réduction négative, sans plancher (gaz vers fioul : −19,68 tCO2e pour 1 000 MWh) |
| Effets rebond | non pris en compte (documentation, 7.2.3.6) |
| Outre-mer | 23 EPCI refusés (`missing_data`) faute de parc de logements |
