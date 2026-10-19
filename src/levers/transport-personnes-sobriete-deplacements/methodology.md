# Transport de personnes, sobriété des déplacements

Identifiant : `transport_personnes_sobriete_deplacements`. Niveaux : région, département et EPCI. Hypothèse nommée qui s'applique : `railElectricityUpstreamShare` (`docs/methodology/assumptions.md`). Les valeurs par défaut que le calcul applique sont renvoyées dans `appliedAssumptions`, avec leur source et leur limite. Métropole seule : l'outre-mer est absent des données et renvoie `missing_data`.

## Formule

```
Émissions évitées (tCO2e/an) =
  r × 52,14 ÷ 1 000 × ( PK_voiture × FE_voiture + PK_TC × FE_TC )

FE_voiture = facteur du parc de voitures ÷ 1,165
FE_TC = part du ferré × FE_ferré + (1 − part du ferré) × facteur du parc de bus ÷ 10
```

| Terme | Sens | Unité |
|---|---|---|
| `r` | « Pourcentage de réduction des distances moyennes hebdomadaires domicile - travail », saisi | fraction |
| `PK_voiture` | passagers.km hebdomadaires domicile-travail en voiture, 50 % côté résidence et 50 % côté travail | passagers.km par semaine |
| `PK_TC` | passagers.km hebdomadaires domicile-travail en transport en commun, ferré et routier ensemble | passagers.km par semaine |
| `FE_voiture` | facteur du parc de voitures par passager.km | kgCO2e par passager.km |
| `FE_TC` | facteur du transport en commun, moyenne pondérée du ferré et du bus | kgCO2e par passager.km |
| `FE_ferré` | 0,0229 en France continentale, 0,187 en Corse | kgCO2e par passager.km |
| part du ferré | part des passagers.km de transport en commun en ferré, saisie ou par défaut | fraction |

La formule est lue dans les formes de la feuille `TrsptPers_SobriétéDéplacements` ; la cellule « Formule » ne contient que « Réduction GES = ». Le dessin multiplie les facteurs des voitures par le taux de remplissage ; la cellule `B15` dit de diviser pour les voitures, elle ne dit rien du bus, que la correction 1 divise par analogie (le tableur annonce pourtant ses facteurs de bus en kgCO2e/passager.km, ce qui contredit le dessin) : la correction 1 de `docs/methodology/formula-corrections.md` s'applique. Contrairement au levier d'efficacité, les passagers.km de transport en commun comptent en entier : le facteur du transport en commun porte déjà la part du ferré.

## Entrées

| Entrée | Unité | Bornes |
|---|---|---|
| `commutingDistanceReductionFraction` | fraction des distances domicile-travail | 0 à 1 |
| `railShareFraction` | fraction | 0 à 1, facultative |

## Constantes

| Constante | Valeur | Source |
|---|---|---|
| Semaines par an | 52,14 | formule dessinée dans les formes de la feuille |
| Taux de remplissage des voitures | 1,165 passager | `DonneesReference!D26` |
| Taux de remplissage des bus | 10 passagers | `DonneesReference!D28` |
| Facteur du ferré, France continentale | 0,0229 kgCO2e/passager.km | `DonneesReference!D37` et G37 (liens Base Empreinte) ; TER moyen 2022, amont de l'électricité sans la fabrication (0,00479), combustion nulle : choix de conception, non vérifié à la source |
| Facteur du ferré, Corse | 0,187 kgCO2e/passager.km | Base Empreinte, train de voyageurs de Corse |
| Part du ferré par défaut | 82 % en Île-de-France, 24 % ailleurs | `ParametreDeterminants` ligne 38 (le tableur donne 84 % et 23 % en 2023, à titre indicatif) ; SDES, Bilan annuel des transports 2024 |

## Données

Les jeux `transport-personnes/regions`, `departements` et `epcis` du levier d'efficacité : passagers.km en voiture et en transport en commun, facteurs d'émission du parc de voitures et de bus.

## Choix faits

| # | Choix | Source ou statut |
|---|---|---|
| 1 | Le facteur du ferré est celui de l'amont de l'électricité seul, sans la fabrication | hypothèse nommée `railElectricityUpstreamShare` ; renvoyé dans `appliedAssumptions.railEmissionFactor` |
| 2 | Un territoire dont toutes les communes sont en Corse prend le facteur corse, les autres le facteur continental | `DonneesReference!D37` ; un territoire à cheval sur la Corse et une autre région, ou sans commune connue, prend le facteur continental : choix de conception, non validé |
| 3 | Un seul facteur de bus : la moyenne du parc, en kgCO2e par véhicule.km ÷ 10, sans distinguer diesel, gaz et électrique | cohérent avec le levier d'efficacité ; choix de conception, non validé |
| 4 | La réduction porte sur toutes les distances domicile-travail, voiture et transport en commun, à la même fraction | le tableur ne donne qu'un paramètre ; choix de conception, non validé |
| 5 | Les passagers.km comptent pour moitié côté résidence et pour moitié côté travail | `TrsptPers_SobriétéDéplacements!B13` |
| 6 | La part du ferré a une valeur par défaut | `ParametreDeterminants` ligne 38 ; renvoyée dans `appliedAssumptions.railShare` quand elle n'est pas saisie |

## Cas de test chiffrés

| Entrée | Résultat |
|---|---|
| 1 000 passagers.km par semaine en voiture à 0,1 kgCO2e/passager.km et 1 000 en transport en commun à 0,044 (60 % de ferré à 0,02, bus à 0,08), tous supprimés | 7,50816 tCO2e |
| idem, la moitié supprimée | 3,75408 tCO2e |
| voitures seules | 5,214 tCO2e |
| transport en commun seul | 2,29416 tCO2e |
| région 84, jeu de test, 10 % de distance en moins | 867,07 tCO2e |
| région 11, jeu de test | 694,39 tCO2e |
| région 94, jeu de test, ferré corse | 1 072,42 tCO2e |
| région 84, données réelles | 210 283,74 tCO2e |
| région 53 (Bretagne) | 98 205,48 tCO2e |
| région 11 (Île-de-France) | 219 204,62 tCO2e |
| région 94 (Corse) | 7 400,08 tCO2e |
| département 69 | 44 008,6 tCO2e |
| département 75 | 26 206,51 tCO2e |
| département 2A | 3 361,87 tCO2e |
| EPCI 200046977 | 30 071,82 tCO2e |
| région 84, données réelles, 60 % de ferré saisi | 207 033,1 tCO2e |

Les lignes « données réelles » sont calculées à 10 % de distance en moins (`r` = 0,1). Elles sont recalculées hors du dépôt (Python, `Decimal`) à partir des CSV.

## Limites

| Limite | Effet |
|---|---|
| Hexagone et moins de 100 km | mêmes limites que le levier d'efficacité : millésime 2022, DOM absents |
| Domicile-travail seul | les autres motifs de déplacement ne sont pas comptés |
| Combustion du ferré continental | supposée nulle, non vérifiée dans la Base Empreinte : si les TER diesel comptent, le facteur continental monte et le résultat aussi |
| Un seul facteur pour tout le ferré | un territoire avec métro ou tram a son propre facteur, souvent plus bas |
| Part du ferré par défaut | une valeur par groupe de régions, voir le levier d'efficacité |
| EPCI sans bus ni car immatriculé | 273 EPCI ont des passagers.km de transport en commun et aucun bus classé : leur part routière est chiffrée au facteur national du parc de bus, signalé dans `appliedAssumptions` ; saisir `railShareFraction` si le réseau est surtout ferré |
| Facteur des voitures | facteur du parc, pas celui du trajet |
| Deux-roues motorisés | sans terme |
