# Résidentiel, rénovation

Identifiant : `residentiel_renovation`. Niveaux : région, département et EPCI, tous `workaround`. Le levier est une approximation : la consommation par m² avant rénovation (CEREN, non ouvert) est remplacée par des parts nationales du SDES (choix 1). Les collectifs d'après 1971 rejoignent le niveau BBC rénovation de la documentation (choix 3), les maisons et les collectifs d'avant 1971 gagnent 35 %. Métropole seule, comme `residentiel_sobriete`.

## Formule

```
E_v     = C_v × part_chauffage_ECS_v                      énergie de chauffage et d'ECS
i_v     = E_v × 1 000 ÷ S_v                               consommation actuelle par m² (kWh/m²)
plafond_v = min(110 ÷ EP_v ; 11 ÷ FE_v)                   niveau BBC rénovation (kWh/m²)
évité_v = p × [ 35 % × E_v × part_éligible_v
              + max(0 ; i_v − plafond_v) × S_v × (1 − part_éligible_v) ÷ 1 000 ]
Émissions évitées (tCO2e/an) = Σ_v évité_v × FE_v

v : électricité, gaz naturel, fioul domestique, GPL, chaleur commercialisée
```

| Terme | Sens | Unité |
|---|---|---|
| `p` | « Pourcentage rénovation parc immobilier », saisi, entre 0 et 1 | fraction |
| `35 %` | baisse de consommation d'une maison ou d'un appartement d'avant 1971 rénové (exigence de l'ANAH) | fraction |
| `S_v` | m² du territoire chauffés au combustible de `v`, tous types et toutes périodes | m² |
| `EP_v` | coefficient d'énergie primaire du DPE : 1,9 pour l'électricité (arrêté du 13 août 2025, depuis le 1er janvier 2026 ; 2,3 avant), 1 pour les autres énergies (choix de conception, non validé) | sans unité |
| `110`, `11` | niveau BBC rénovation : kWhEP/m²/an et kgCO2e/m²/an (documentation p. 54 ; tableur `B13`) | |
| `C_v` | consommation résidentielle du vecteur `v`, tous usages, lue comme dans `residentiel_sobriete` | MWh |
| `part_chauffage_ECS_v` | part nationale du chauffage et de l'eau chaude sanitaire dans cette consommation (SDES 2024) | fraction |
| `part_éligible_v` | part des m² des logements chauffés au combustible de `v` qui sont des maisons (toutes périodes) ou des appartements d'avant 1971 ; le complément est le collectif d'après 1971 | fraction |
| `FE_v` | facteur d'émission du vecteur ; la chaleur : moyenne pondérée des réseaux du territoire | kgCO2e/kWh |

La cellule « Formule » du tableur est vide (« Réduction GES = »). La formule est lue dans ses commentaires et dans la documentation (p. 53 : « la consommation énergétique moyenne au m², avant et après rénovation ») : économie = m² rénovés × (kWh/m² avant − kWh/m² après) × FE, où « après » = 65 % de « avant » pour les maisons et les appartements d'avant 1971. Les kWh/m² étant les mêmes pour tous les logements d'un même vecteur (choix 1), la somme des m² éligibles × kWh/m² revient à la consommation du vecteur × la part éligible. Pour les collectifs d'après 1971, « après » est le plus bas des deux plafonds du BBC rénovation : la consommation ne baisse que si elle dépasse le plafond (`max(0 ; …)`).

## Entrées

| Entrée | Unité | Bornes |
|---|---|---|
| `renovatedParcFraction` | fraction du parc | 0 à 1 |

Obligatoire, sans valeur par défaut ni valeur de la SNBC 3 (`F19` et `E19` valent 0). La documentation (p. 54) permet aussi une part par typologie de logement : non reprise (choix 5).

## Constantes

| Constante | Valeur | Source |
|---|---|---|
| Baisse de consommation après rénovation | 35 % | documentation, pp. 53-54 ; `Residentiel_Rénovation!B13` et `A34` : exigence de l'ANAH |
| Parts du chauffage et de l'ECS | 46,7 % (électricité), 92,6 % (gaz), 100 % (fioul), 53,2 % (GPL), 100 % (chaleur) | SDES Conso_usage 2024, documentation p. 51 ; `src/domain/residential-heating-shares.ts` |
| FE électricité, gaz, fioul, GPL | comme `residentiel_sobriete` | `src/domain/emission-factors.ts` |

## Données

Aucun jeu propre. La consommation vient de `src/application/residential-consumption/` (jeux de `residentiel_sobriete`), les m² du parc INSEE de `residentiel-logements/logements-departement` (département et région : somme des départements de la région) et de `residentiel-logements/logements-epci-departement` (EPCI : somme de ses lignes).

## Choix faits

| # | Choix | Source ou statut |
|---|---|---|
| 1 | Consommation avant rénovation = consommation du territoire × part nationale du chauffage et de l'ECS, la même au m² pour tous les types, combustibles identiques et toutes les périodes | interprétation nouvelle, remplace le CEREN non ouvert (`Residentiel_Rénovation!G24`) ; suppose le même usage partout |
| 2 | Maisons et appartements d'avant 1971 : « après » = 65 % de « avant » | documentation p. 54 ; `A34` |
| 3 | Collectifs d'après 1971 (privé et social, 1971-2005 et après 2005) : leur consommation par m² après rénovation est plafonnée au niveau BBC rénovation, 110 kWhEP/m²/an et 11 kgCO2e/m²/an | documentation p. 54 : « alignées sur les exigences BBC rénovation » ; seuils : tableur `B13` ; interprétation nouvelle : la documentation ne donne ni la formule (équation 7, image) ni les coefficients d'énergie primaire, 1,9 pour l'électricité et 1 pour les autres énergies sont les coefficients du DPE en vigueur, choix de conception, non validé, non relu sur Légifrance ; le plafond d'émissions est évalué avec les facteurs d'émission de la documentation (7.2.1.2), non ceux du DPE ; la consommation avant rénovation est celle du territoire pour l'énergie, la même pour tous ses logements |
| 4 | La part éligible d'un vecteur sans logement chauffé à ce combustible vaut 0 | choix de conception, non validé |
| 5 | Une seule part de parc rénové pour tous les types | documentation p. 54 : « par défaut de façon homogène » |
| 6 | Climatisation non comptée | documentation p. 51 : chauffage et ECS ; le tableur ajoute la climatisation (`B13`), 2,6 TWh d'électricité en 2024 |
| 7 | Bois : consommation de base 0, rien à rénover | documentation pp. 52-53 : l'INSEE n'a pas de bois ; limite reconnue |
| 8 | Territoire sans réseau de chaleur : facteur de la chaleur nul | comme `residentiel_sobriete` (choix 15) |

## Cas de test

| Entrée | Résultat |
|---|---|
| 1 000 MWh d'électricité, tout éligible, 100 % du parc | 5,72 tCO2e |
| 1 000 MWh de gaz naturel, idem | 65,2 tCO2e |
| 1 000 MWh de fioul, idem | 93,9 tCO2e |
| 1 000 MWh de GPL, idem | 42,3 tCO2e |
| 1 000 MWh de chaleur à 0,1 kgCO2e/kWh, idem | 35 tCO2e |
| 1 000 MWh de gaz, 10 000 m² dont la moitié de collectif d'après 1971, 100 % du parc | 70,74 tCO2e (32,60 + 38,14) |
| 1 000 MWh d'électricité, mêmes surfaces | 2,86 tCO2e (sous le plafond de 57,89 kWh/m², aucun gain BBC) |
| 1 000 MWh d'électricité, 5 000 m² dont la moitié de collectif d'après 1971 | 5,97 tCO2e (2,86 + 3,11) |
| 1 000 MWh de fioul, mêmes surfaces | 126,08 tCO2e (46,95 + 79,14) |
| 1 000 MWh de GPL, mêmes surfaces | 26,57 tCO2e (21,15 + 5,42) |
| 1 000 MWh de chaleur à 0,2 kgCO2e/kWh, mêmes surfaces | 80 tCO2e (35 + 45) |
| département 01, jeu de test, 50 % du parc | 435,28 tCO2e |
| région 84, jeu de test (parc des départements 01 et 69), 50 % du parc | 1 509,1 tCO2e |
| département 35, données réelles, 50 % du parc | 91 426,41 tCO2e |
| région 84, données réelles | 754 753,66 tCO2e |
| somme des 13 régions | 5 912 083,49 tCO2e |
| somme des 96 départements | 5 975 596,1 tCO2e |
| somme des 1 232 EPCI | 5 971 533,38 tCO2e |

Les valeurs synthétiques et celles du département 35 (électricité, gaz, fioul, GPL et chaleur) sont recalculées hors du dépôt (Python, `Decimal`) à partir des CSV et des constantes.

## Limites

| Limite | Effet |
|---|---|
| Consommation par m² moyenne nationale | un département plus ou moins chauffé que la France, ou des logements plus ou moins énergivores, sont mal estimés ; les moyennes nationales sont, en énergie finale pour le chauffage et l'ECS : électricité 84 kWh/m², gaz 109, fioul 122, GPL 98, chaleur 146, bois 164 (65,9 TWh du SDES sur les m² « autre »), recalculées le 2026-11-26 : consommation régionale × part du chauffage et de l'ECS ÷ m² du parc INSEE chauffés à cette énergie ; un gradient par période de construction (Phébus 2013, CGDD n° 645 : de 0,017 tep/m² avant 1970 à 0,012 après 2006) changerait la part éligible de moins de 4 % (électricité +2,1 %, gaz +3,7 %, fioul +0,5 %, GPL +1,0 %), de 13,8 % pour la chaleur |
| Collectifs d'après 1971 | plafonds du BBC rénovation lus avec les coefficients d'énergie primaire du DPE et les facteurs d'émission de la documentation : gain par énergie après rénovation environ −31 % pour l'électricité, −50 % pour le gaz, −66 % pour le fioul, −51 % pour le GPL sur la consommation moyenne nationale ; la consommation par m² du territoire est supposée la même pour les logements récents et anciens |
| Régions, départements et EPCI | les totaux diffèrent d'environ 1 % (4,48, 4,52 et 4,53 MtCO2e à 50 % du parc) : les consommations viennent de trois jeux différents (bilan régional, IRIS départemental, SDES à l'EPCI), la part éligible du même parc INSEE ; comme `residentiel_sobriete` |
| EPCI sans surface de logements | la consommation de l'EPCI, lue en amont, échoue déjà en `missing_data` ; le levier ne le vérifie pas une seconde fois |
| Logements déjà rénovés | les consommations moyennes embarquent des logements déjà rénovés et le parc « disponible » à rénover n'est pas déduit : les gains sont sous-estimés (tableur, `B15`) |
| Constructions postérieures au recensement | non comptées (documentation, p. 54) |
| Effets rebond | non pris en compte (documentation, 7.2.2.6) |
| Bois | absent des données du territoire |
| Outre-mer | 23 EPCI refusés (`missing_data`) faute de parc de logements |
