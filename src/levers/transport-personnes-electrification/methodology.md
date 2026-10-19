# Transport de personnes, électrification

Identifiant : `transport_personnes_electrification`. Niveaux : région, département et EPCI. Les interprétations ci-dessous sont encodées dans les données et le code, et chacune est listée dans « Choix faits ». Les valeurs par défaut, les plafonds et les facteurs que le calcul applique sont renvoyés dans `appliedAssumptions`, avec leur source et leur limite. Métropole seule : l'outre-mer est absent des données et renvoie `missing_data`.

## Formule

```
x'_m = min(x_m ; part thermique du parc_m)

Émissions évitées (tCO2e/an) = Σ_m  x'_m × PK_m × 52,14 × (FE_thermique_m − FE_électrique_m) ÷ T_m ÷ 1 000

m : voiture, bus et car
PK_voiture = passagers.km hebdomadaires domicile-travail en voiture
PK_bus = passagers.km hebdomadaires en transport en commun × (1 − part du ferré)
```

| Terme | Sens | Unité |
|---|---|---|
| `x_m` | part du parc du mode à électrifier, saisie, entre 0 et 1 | fraction du parc entier |
| `x'_m` | part effectivement électrifiée : la part saisie, plafonnée à la part thermique du parc | fraction du parc entier |
| `PK_m` | passagers.km hebdomadaires du mode, 50 % côté résidence et 50 % côté travail | passagers.km par semaine |
| `FE_thermique_m` | facteur d'émission moyen des véhicules thermiques du parc du mode | kgCO2e par véhicule.km |
| `FE_électrique_m` | facteur d'émission d'un véhicule électrique, amont seul | kgCO2e par véhicule.km |
| `T_m` | taux de remplissage : 1,165 passager par voiture, 10 par bus | passagers par véhicule |
| part du ferré | part des passagers.km de transport en commun en ferré, saisie ou par défaut | fraction |

## Entrées

| Entrée | Unité | Bornes |
|---|---|---|
| `carElectrificationFraction` | fraction du parc de voitures | 0 à 1 |
| `busElectrificationFraction` | fraction du parc de bus et cars | 0 à 1 |
| `railShareFraction` | fraction | 0 à 1, facultative |

Les deux premières sont obligatoires. La part du ferré est facultative (voir choix 4).

## Constantes

| Constante | Valeur | Source |
|---|---|---|
| Semaines par an | 52,14 | formule dessinée dans les formes de la feuille `TrsptPers_Efficacité` ; reprise à l'identique |
| Taux de remplissage des voitures | 1,165 passager | SDES, « Se déplacer en voiture » ; `DonneesReference!D26` |
| Taux de remplissage des bus | 10 passagers | `DonneesReference!D28` |
| Facteur d'une voiture électrique | 0,013345 kgCO2e/véh.km | fiche d'analyse 11, amont seul |
| Facteur d'un bus électrique | 0,095 kgCO2e/véh.km | 0,0095 kgCO2e/passager.km (Base Empreinte) × 10 passagers, amont seul |
| Part du ferré par défaut | 82 % en Île-de-France, 24 % ailleurs | SDES, Bilan annuel des transports 2024, figures F1-4 et F2-1 |

## Données

| Jeu | Colonnes lues en plus de celles de l'efficacité | Niveau |
|---|---|---|
| `transport-personnes/regions` | facteur et part du parc thermique, voitures et bus | région |
| `transport-personnes/departements` | idem | département |
| `transport-personnes/epcis` | idem | EPCI |

Construction : `pnpm build:data:transport-personnes`. Les voitures thermiques sont l'essence, le diesel et le gaz ; les bus et cars thermiques sont le diesel et le gaz. La part thermique est rapportée au parc entier, carburants sans facteur compris.

## Choix faits

| # | Choix | Source ou statut |
|---|---|---|
| 1 | La part saisie est une part du parc entier, pas une part des véhicules thermiques | choix de conception, non validé |
| 2 | Une part saisie supérieure à la part thermique du parc est plafonnée, pas refusée | choix de conception, non validé ; renvoyé dans `appliedAssumptions.carElectrificationFraction` et `busElectrificationFraction` quand le plafond joue |
| 3 | Le véhicule électrique est compté en amont seul, sans émission à l'échappement ni mix électrique du territoire | renvoyé dans `electricCarEmissionFactor` et `electricBusEmissionFactor` |
| 4 | La part du ferré a une valeur par défaut, 82 % en Île-de-France et 24 % ailleurs | voir le levier d'efficacité ; renvoyée dans `appliedAssumptions.railShare` quand elle n'est pas saisie |
| 5 | Les passagers.km du transport en commun routier = transport en commun × (1 − part du ferré) | `DonneesTerritoires!D14` |
| 6 | Les passagers.km comptent pour moitié côté résidence et pour moitié côté travail | `TrsptPers_SobriétéDéplacements!B13` |
| 7 | Un territoire sans véhicule thermique a une part thermique nulle : le facteur national de repli qu'il porte ne joue pas, le résultat est nul | cohérent avec le choix 2 |

## Cas de test chiffrés

| Entrée | Résultat |
|---|---|
| bus seuls, 1 000 passagers.km par semaine dont 60 % en ferré, 0,8 contre 0,095 kgCO2e/véh.km, tout le parc | 1,470348 tCO2e |
| voitures seules, 1 000 passagers.km par semaine, 0,1165 contre 0,013345 kgCO2e/véh.km, tout le parc | 4,61674 tCO2e |
| voitures et bus ensemble, mêmes données | 6,087088 tCO2e |
| tout le transport en commun en ferré | 0 tCO2e |
| région 84, jeu de test, moitié du parc | 4 902,41 tCO2e |
| région 84, jeu de test, parc entier demandé, plafonné à 90 % et 80 % | 8 544,97 tCO2e |
| région 11, jeu de test, moitié du parc | 3 836,4 tCO2e |
| région 84, données réelles, moitié du parc | 988 260,06 tCO2e |
| région 53 (Bretagne) | 461 119,62 tCO2e |
| région 11 (Île-de-France) | 936 872,82 tCO2e |
| département 69 | 206 654,02 tCO2e |
| département 75 | 92 557,47 tCO2e |
| EPCI 200046977 | 140 960,17 tCO2e |
| région 84, données réelles, parc entier demandé (plafonné à 97,06 % des voitures et 96,50 % des bus) | 1 917 970,69 tCO2e |

Les valeurs sur données réelles sont recalculées hors du dépôt (Python, `Decimal`) à partir des CSV.

## Limites

| Limite | Effet |
|---|---|
| Hexagone et moins de 100 km | mêmes limites que le levier d'efficacité : millésime 2022, DOM absents, « Annuelle sans garantie » |
| Facteur électrique amont seul | un bus ou une voiture électrique est compté à un facteur unique, quel que soit le mix du territoire |
| Parc de bus et cars immatriculé au siège | trois communes portent 17,7 % du parc métropolitain : la part thermique d'un EPCI peut être très éloignée de la réalité des trajets |
| Part du ferré par défaut | une valeur par groupe de régions, voir le levier d'efficacité |
| Voiture et bus déjà électriques | leur part est écartée par le plafond : on ne peut pas électrifier deux fois |
| Deux-roues motorisés | sans terme |
