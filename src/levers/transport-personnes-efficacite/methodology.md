# Transport de personnes, efficacité énergétique

Identifiant : `transport_personnes_efficacite`. Niveaux : région, département et EPCI. Aucune question ouverte côté ADEME ; les interprétations ci-dessous sont encodées dans les données et le code, et chacune est listée dans « Choix faits ». Les valeurs par défaut et les exclusions que le calcul applique sont renvoyées dans `appliedAssumptions`, avec leur source et leur limite. Métropole seule : l'outre-mer est absent des données et renvoie `missing_data`.

## Formule

```
baisse_m = 1 − 1 / (1 + p_m) × (1 − a_m × 15 %)

Émissions évitées (tCO2e/an) = Σ_m  baisse_m × PK_m × 52,14 × FE_m ÷ T_m ÷ 1 000

m : voiture, bus et car
PK_voiture = passagers.km hebdomadaires domicile-travail en voiture
PK_bus = passagers.km hebdomadaires en transport en commun × (1 − part du ferré)
```

| Terme | Sens | Unité |
|---|---|---|
| `a_m` | « % Application de l'éco conduite voyageurs », saisi, entre 0 et 1 | fraction |
| `p_m` | « % Augmentation nombre de voyageurs par véhicule », saisi, 0 ou plus | variation relative |
| `PK_m` | passagers.km hebdomadaires du mode, 50 % côté résidence et 50 % côté travail | passagers.km par semaine |
| `FE_m` | facteur d'émission moyen du parc du mode | kgCO2e par véhicule.km |
| `T_m` | taux de remplissage : 1,165 passager par voiture, 10 par bus | passagers par véhicule |
| part du ferré | part des passagers.km de transport en commun en ferré, saisie ou par défaut | fraction |

Le tableur ne fournit pas la cellule « Formule » (elle ne contient que « Réduction GES = ») : la formule est lue dans les formes de la feuille `TrsptPers_Efficacité`. Deux écarts avec le dessin sont corrigés, voir `docs/methodology/formula-corrections.md` : le facteur est divisé par le taux de remplissage (correction 1), et les deux gains se multiplient au lieu de s'additionner (correction 2).

## Entrées

| Entrée | Unité | Bornes |
|---|---|---|
| `carEcodrivingApplicationFraction` | fraction | 0 à 1 |
| `busEcodrivingApplicationFraction` | fraction | 0 à 1 |
| `carPassengerIncrease` | variation relative | 0 ou plus |
| `busPassengerIncrease` | variation relative | 0 ou plus |
| `railShareFraction` | fraction | 0 à 1, facultative |

Les quatre premières sont obligatoires : le tableur les laisse vides, et la colonne « valeur de référence de la SNBC 3 » est vide. La part du ferré est facultative (voir choix 5).

## Constantes

| Constante | Valeur | Source |
|---|---|---|
| Semaines par an | 52,14 | forme de la feuille `TrsptPers_Efficacité` |
| Potentiel de baisse par écoconduite | 15 % | `DonneesReference!D29` : « ~15% » ; la page citée dit « jusqu'à 15 % de carburant » |
| Taux de remplissage des voitures | 1,165 passager | SDES, « Se déplacer en voiture » ; `DonneesReference!D26` |
| Taux de remplissage des bus | 10 passagers | `DonneesReference!D28` |
| Part du ferré par défaut | 82 % en Île-de-France, 24 % ailleurs | SDES, Bilan annuel des transports 2024, figures F1-4 et F2-1 |

## Données

| Jeu | Contenu | Niveau |
|---|---|---|
| `transport-personnes/regions` | passagers.km par semaine, facteurs d'émission du parc, parts exclues, véhicules classés | région |
| `transport-personnes/departements` | idem | département |
| `transport-personnes/epcis` | idem | EPCI |

Construction des jeux : `pnpm build:data:transport-personnes`, depuis les deux sources versionnées de `data/transport-personnes/sources/` (trajets Insee-SDES 2022 et parc SDES 2025). Le détail des colonnes est dans `data/transport-personnes/manifest.json`.

La part du ferré par défaut dépend de la région : un territoire dont toutes les communes sont en Île-de-France (code région 11) prend 82 %, les autres 24 %.

## Choix faits

| # | Choix | Source ou statut |
|---|---|---|
| 1 | Un seul potentiel d'écoconduite, 15 %, pour les voitures et pour les bus et cars | le tableur donne une seule valeur (`DonneesReference!D29`) pour deux paramètres ; choix de conception, non validé. Le plafond « jusqu'à 15 % » sert de moyenne |
| 2 | Facteur du bus : la valeur basse de OMINEA 2024 (0,0805 kgCO2e/passager.km pour le diesel) contre 0,0874 pour Base Empreinte | choix de conception, non validé ; renvoyé dans `appliedAssumptions.busEmissionFactor` |
| 3 | Les carburants sans facteur sont exclus de la moyenne du parc : « autre » pour les voitures, « essence » et « autre » pour les bus | la part exclue est renvoyée dans `carFleetUnclassifiedShare` et `busFleetUnclassifiedShare` quand elle n'est pas nulle |
| 4 | Un territoire sans voiture ou sans bus classé prend la moyenne nationale | renvoyé dans `nationalCarEmissionFactor` et `nationalBusEmissionFactor` |
| 5 | La part du ferré a une valeur par défaut, 82 % en Île-de-France et 24 % ailleurs | le tableur la donne à titre indicatif seulement (84 % et 23 % en 2023, `TrsptPers_Efficacité!G23`) ; renvoyée dans `appliedAssumptions.railShare` quand elle n'est pas saisie |
| 6 | Passagers.km du transport en commun routier = transport en commun × (1 − part du ferré) | `DonneesTerritoires!D14` |
| 7 | Les passagers.km comptent pour moitié côté résidence et pour moitié côté travail | `TrsptPers_SobriétéDéplacements!B13` |
| 8 | Les facteurs d'émission des voitures viennent d'un calcul d'essai sur OMINEA v23.1, non reproduit dans le dépôt | voir la PR des données ; essence 171,1, diesel 163,6, gaz 231,5, électrique 13,345 g/véh.km |
| 9 | Les hausses de passagers n'ont pas de plafond | le tableur n'en pose pas |

## Cas de test chiffrés

| Entrée | Résultat |
|---|---|
| voitures seules, 1 000 passagers.km par semaine à 0,1 kgCO2e/passager.km, écoconduite à 100 % | 0,7821 tCO2e |
| idem, écoconduite à 50 % et 10 % de passagers en plus | 0,8295 tCO2e (baisse de 15,9 %, 16,6 % si les gains s'additionnaient) |
| idem, 100 % de passagers en plus | 2,607 tCO2e |
| bus seuls, 1 000 passagers.km par semaine dont 60 % en ferré, 0,8 kgCO2e/véh.km, écoconduite à 100 % | 0,250272 tCO2e |
| tout le transport en commun en ferré | 0 tCO2e |
| région 84, jeu de test, hors Île-de-France | 1 257,62 tCO2e |
| région 11, jeu de test, Île-de-France | 894,72 tCO2e |
| région 84, données réelles, 100 % d'écoconduite | 314 061,19 tCO2e |
| région 53 (Bretagne) | 147 001,27 tCO2e |
| région 11 (Île-de-France) | 295 411,07 tCO2e |
| département 69 | 65 383,38 tCO2e |
| département 75 | 28 823 tCO2e |
| EPCI 200046977 | 44 549,63 tCO2e |
| région 84, 50 % d'écoconduite et 10 % de passagers en plus | 333 095,2 tCO2e |

Les valeurs sur données réelles sont recalculées hors du dépôt (Python, `Decimal`) à partir des CSV.

## Limites

| Limite | Effet |
|---|---|
| Hexagone et moins de 100 km | 772 644 actifs métropolitains qui se déplacent sont hors champ de la base, ainsi que les DOM ; millésime 2022, « Annuelle sans garantie » |
| Potentiel d'écoconduite | un plafond, pas une moyenne : le résultat lui est proportionnel |
| Deux-roues motorisés | sans terme : 1,4 % des passagers.km |
| Parc de bus et cars immatriculé au siège | trois communes portent 17,7 % du parc métropolitain ; 276 des 1 243 EPCI n'ont aucun bus ni car classé et 11 aucune voiture : ils prennent la moyenne nationale |
| Part du ferré par défaut | une valeur par groupe de régions : un territoire avec un grand métro hors Île-de-France (Lyon, Marseille, Lille) a une part ferrée plus haute, et ses bus sont surévalués |
| Facteur des voitures | les voitures sont comptées avec le facteur du parc, pas celui du trajet |
| Outre-mer | absent des données |

## Errata à remonter à l'ADEME

| Constat | Cellule |
|---|---|
| Le texte dit que la baisse totale est une somme, le dessin la calcule comme un produit | `TrsptPers_Efficacité!B13` |
| Le dessin multiplie les FE par le taux de remplissage ; la cellule des onglets voisins dit de diviser | `TrsptPers_SobriétéDéplacements!B15` |
| Deux paramètres distincts portent la même abréviation, « % Application de l'éco conduite voyageurs » (voitures, conducteurs de transport en commun) ; de même « % Augmentation nombre de voyageurs par véhicule » | `ParametreDeterminants!B30:B33` |
| La formule a deux potentiels d'écoconduite ; une seule ligne, dont la valeur est dans la colonne des commentaires | `DonneesReference!D29` |
| La ligne « Taux de remplissage moyen des VP autres trajets » est listée et la formule ne l'utilise pas | `TrsptPers_Efficacité!A37` |
