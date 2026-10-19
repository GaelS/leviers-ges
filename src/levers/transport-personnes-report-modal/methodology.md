# Transport de personnes, report modal

Identifiant : `transport_personnes_report_modal`. Niveaux : région, département et EPCI. Deux hypothèses nommées de `docs/methodology/assumptions.md` s'appliquent (`railElectricityUpstreamShare`, `passengerCarLastLineKept`) ; les valeurs par défaut que le calcul applique sont renvoyées dans `appliedAssumptions`, avec leur source et leur limite. Métropole seule : l'outre-mer est absent des données et renvoie `missing_data`.

## Formule

```
Émissions évitées (tCO2e/an) =
  PK_voiture × 52,14 ÷ 1 000
  × ( r_TC × (FE_voiture − FE_TC) + r_actifs × (FE_voiture − 0) )

FE_voiture = facteur du parc de voitures ÷ 1,165
FE_TC = part du ferré × FE_ferré + (1 − part du ferré) × facteur du parc de bus ÷ 10
```

| Terme | Sens | Unité |
|---|---|---|
| `r_TC` | « Pourcentage de report modal de la voiture vers les transports en commun (proportion des km en voiture) », saisi | fraction des passagers.km en voiture |
| `r_actifs` | « Pourcentage de report modal de la voiture vers les modes actifs », saisi ; leur facteur est nul | fraction des passagers.km en voiture |
| `PK_voiture` | passagers.km hebdomadaires domicile-travail en voiture, 50 % côté résidence et 50 % côté travail | passagers.km par semaine |
| `FE_voiture` | facteur du parc de voitures par passager.km | kgCO2e par passager.km |
| `FE_TC` | facteur du transport en commun, moyenne pondérée du ferré et du bus | kgCO2e par passager.km |
| `FE_ferré` | 0,0229 en France continentale, 0,187 en Corse | kgCO2e par passager.km |
| part du ferré | part des passagers.km de transport en commun en ferré, saisie ou par défaut | fraction |

La formule est lue dans les formes de la feuille `TrsptPers_ReportModal` ; la cellule « Formule » ne contient que « Réduction GES = ». L'écart de la correction 1 de `docs/methodology/formula-corrections.md` s'applique : le facteur est divisé par le taux de remplissage, il n'est pas multiplié.

## Entrées

| Entrée | Unité | Bornes |
|---|---|---|
| `carToPublicTransportFraction` | fraction des passagers.km en voiture | 0 à 1 |
| `carToActiveModesFraction` | fraction des passagers.km en voiture | 0 à 1 |
| `railShareFraction` | fraction | 0 à 1, facultative |

Les deux reports sont obligatoires et leur somme ne dépasse pas 1 : le tableur dit « Le report modal total doit être inférieur à 100% » (`ParametreDeterminants`, lignes 34 et 35). La requête est refusée sinon.

## Constantes

| Constante | Valeur | Source |
|---|---|---|
| Semaines par an | 52,14 | formule dessinée dans les formes de la feuille |
| Taux de remplissage des voitures | 1,165 passager | `DonneesReference!D26` |
| Taux de remplissage des bus | 10 passagers | `DonneesReference!D28` |
| Facteur du ferré, France continentale | 0,0229 kgCO2e/passager.km | Base Empreinte, TER moyen 2022, amont de l'électricité sans la fabrication (0,00479), combustion nulle |
| Facteur du ferré, Corse | 0,187 kgCO2e/passager.km | Base Empreinte, train de voyageurs de Corse |
| Part du ferré par défaut | 82 % en Île-de-France, 24 % ailleurs | SDES, Bilan annuel des transports 2024 |

## Données

Les jeux `transport-personnes/regions`, `departements` et `epcis` du levier d'efficacité : passagers.km en voiture, facteurs d'émission du parc de voitures et de bus. Le levier ne lit pas les passagers.km de transport en commun : le report ajoute des voyageurs au réseau existant.

## Choix faits

| # | Choix | Source ou statut |
|---|---|---|
| 1 | Le facteur du ferré est celui de l'amont de l'électricité seul, sans la fabrication | hypothèse nommée `railElectricityUpstreamShare` ; le tableur dit « une partie du poste amont à déterminer » ; renvoyé dans `appliedAssumptions.railEmissionFactor` |
| 2 | Un territoire dont toutes les communes sont en Corse prend le facteur corse, les autres le facteur continental | `DonneesReference!D37` ; un territoire à cheval prend le facteur continental |
| 3 | La dernière ligne de la formule des voitures est ignorée : elle reprend un terme déjà dans l'accolade et compterait deux fois le report vers les modes actifs | hypothèse nommée `passengerCarLastLineKept` |
| 4 | Un seul facteur de bus : la moyenne du parc, en kgCO2e par véhicule.km ÷ 10, sans distinguer diesel, gaz et électrique | cohérent avec le levier d'efficacité |
| 5 | Le facteur du transport en commun pondère le ferré et le bus avec la part du ferré, la même qui sert à l'efficacité | `DonneesReference!D37` et `ParametreDeterminants` ; part par défaut renvoyée dans `appliedAssumptions.railShare` |
| 6 | Le résultat peut être négatif si le transport en commun émet plus que la voiture | aucune borne dans le tableur |
| 7 | Les passagers.km comptent pour moitié côté résidence et pour moitié côté travail | `TrsptPers_ReportModal!B13` |

## Cas de test chiffrés

| Entrée | Résultat |
|---|---|
| voitures seules, 1 000 passagers.km par semaine à 0,1 kgCO2e/passager.km, tout vers les modes actifs | 5,214 tCO2e |
| idem, tout vers les transports en commun, 60 % de ferré à 0,02 et bus à 0,08 | 2,91984 tCO2e |
| idem, moitié vers chaque | 4,06692 tCO2e |
| transport en commun plus émetteur que la voiture (0,0233 contre 0,08), tout reporté | −3,1284 tCO2e |
| région 84, jeu de test, 10 % vers les transports en commun et 5 % vers les modes actifs | 436,43 tCO2e |
| région 11, jeu de test | 609,11 tCO2e |
| région 94, jeu de test, ferré corse | 231,08 tCO2e |
| région 84, données réelles | 207 826,72 tCO2e |
| région 53 (Bretagne) | 99 531,56 tCO2e |
| région 11 (Île-de-France) | 229 901,3 tCO2e |
| région 94 (Corse) | 5 437,77 tCO2e |
| département 69 | 40 895,57 tCO2e |
| département 75 | 18 356,06 tCO2e |
| département 2A | 2 522,32 tCO2e |
| EPCI 200046977 | 27 094,4 tCO2e |
| région 84, données réelles, 60 % de ferré saisi | 235 784,77 tCO2e |

Les valeurs sur données réelles sont recalculées hors du dépôt (Python, `Decimal`) à partir des CSV.

## Limites

| Limite | Effet |
|---|---|
| Hexagone et moins de 100 km | mêmes limites que le levier d'efficacité : millésime 2022, DOM absents |
| Domicile-travail seul | les autres motifs de déplacement ne sont pas comptés ; `DonneesReference!D27`, le taux de remplissage des autres trajets, n'est pas utilisé |
| Capacité du réseau | le report n'ajoute pas de véhicule-km : aucun effet de saturation du transport en commun ni d'offre supplémentaire |
| Un seul facteur pour tout le ferré | un territoire avec métro ou tram a son propre facteur, souvent plus bas |
| Part du ferré par défaut | une valeur par groupe de régions, voir le levier d'efficacité |
| Distance des trajets reportés | les modes actifs ne couvrent pas les mêmes distances que la voiture : la fraction porte sur les passagers.km, pas sur les trajets |
| Facteur des voitures | facteur du parc, pas celui du trajet |
