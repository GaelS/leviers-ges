# Fertilisation azotée

Identifiant : `fertilisation_azotee`. Niveaux : région et département. L'EPCI n'est pas calculé : la livraison d'azote n'existe pas à cette maille et le tableur ne la ventile que depuis le département, sans que le résultat se vérifie (`not_computed`). Une hypothèse nommée de `docs/methodology/assumptions.md` s'applique (`nitrogenCampaigns`) ; elle est renvoyée dans `appliedAssumptions` avec le facteur d'émission et leurs limites. Métropole seule : l'outre-mer est absent des données et renvoie `missing_data`.

## Formule

```
Émissions évitées (tCO2e/an) = p × M × FE ÷ 1 000
```

| Terme | Sens | Unité |
|---|---|---|
| `p` | « % de réduction des kg de fertilisants minéraux azotés », saisi | fraction |
| `M` | « masse de fertilisants azotés livrés au territoire » (livrée, pas épandue) | kg d'azote par an, lue en tonnes d'azote |
| `FE` | « FE par kg de fertilisant minéral azoté épandu » | 5,733 kgCO2e par kg d'azote |

La formule est lue dans les formes de la feuille `ChgtPratiques` ; la cellule « Formule » ne contient que « Réduction GES = ». Deux formes sont dessinées : la réduction, et la masse livrée au territoire, ventilée depuis la masse livrée au département par le rapport des surfaces de culture hors bio. Cette seconde forme ne sert qu'à l'EPCI, qui n'est pas calculé : région et département prennent leur masse livrée directement. `M` est lue en tonnes d'azote, multipliée par 1 000 pour les kilogrammes, puis le résultat est divisé par 1 000.

La formule est un proxy (`B12`) : `B13` utilise « la masse de fertilisants minéraux azotés livrés et non épandus car la donnée disponible concerne uniquement les livraisons ».

## Entrées

| Entrée | Unité | Bornes |
|---|---|---|
| `nitrogenReductionFraction` | fraction de la masse d'azote livrée | 0 à 1 |

Obligatoire, sans valeur par défaut ni valeur de la SNBC 3 (`ParametreDeterminants!H8` est vide, `I8` vaut 0). Le tableur ne pose aucune borne ; 0 à 1 par construction.

## Constantes

| Constante | Valeur | Source |
|---|---|---|
| FE de l'épandage d'engrais minéraux azotés | 5,733 kgCO2e/kg d'azote | Base Empreinte, élément 24270, France continentale, poste total, version 23.11, validité décembre 2018, incertitude 400 % ; le jeu ouvert Base Carbone donne 5,73 |
| Campagnes d'une région | 2 | hypothèse nommée `nitrogenCampaigns` ; `DonneesTerritoires!D8` : « Prendre la moyenne sur 2 ans » |

## Données

Jeux `fertilisation-azotee/regions` et `fertilisation-azotee/departements`, construits par `pnpm build:data:fertilisation-azotee` depuis les tableaux UNIFA et France Fertilisants versionnés dans `data/fertilisation-azotee/sources/`.

| Niveau | Donnée |
|---|---|
| Région | tonnes d'azote livrées, moyenne des campagnes 2021-2022 et 2022-2023 |
| Département | tonnes d'azote livrées, campagne 2021-2022 seule |

## Choix faits

| # | Choix | Source ou statut |
|---|---|---|
| 1 | Région : moyenne de 2021-2022 et 2022-2023 ; département : 2021-2022 seule | hypothèse nommée `nitrogenCampaigns` ; le rapport départemental 2022-2023 n'est pas publié ; renvoyé dans `appliedAssumptions.nitrogenCampaigns` |
| 2 | La masse du territoire est la masse livrée à la région ou au département, sans ventilation | `ChgtPratiques!B13` : « à la maille régionale (à utiliser pour les régions) » ; aucune formule départementale n'est dessinée |
| 3 | Les livraisons tiennent lieu d'épandage | proxy du tableur ; `B13` signale le problème des ports et entrepôts d'engrais |
| 4 | Les départements 2A et 2B n'ont pas de livraison : le levier renvoie `missing_data` | la Corse est publiée sous le code 20 sans distinguer 2A et 2B ; choix de conception, non validé |
| 5 | Le facteur d'émission est celui de la France continentale, y compris pour la Corse | Base Empreinte ; renvoyé dans `appliedAssumptions.nitrogenSpreadingEmissionFactor` |
| 6 | La réduction est bornée de 0 à 1 | par construction ; une note antérieure citait une borne de 25 % (surplus national d'azote, bilan ClimAgri), absente du tableur actuel |

## Cas de test chiffrés

| Entrée | Résultat |
|---|---|
| 1 000 t d'azote, 100 % supprimés | 5 733 tCO2e |
| 1 000 t d'azote, 10 % supprimés | 573,3 tCO2e |
| région 84, jeu de test (1 000 et 3 000 t, soit 2 000 t en moyenne), 10 % | 1 146,6 tCO2e |
| département 01, jeu de test (500 t), 10 % | 286,65 tCO2e |
| région 84, données réelles (76 764 t en moyenne), 10 % | 44 008,8 tCO2e |
| région 53 (Bretagne, 132 951,5 t), 10 % | 76 221,09 tCO2e |
| région 11 (Île-de-France, 60 598 t), 10 % | 34 740,83 tCO2e |
| région 94 (Corse, 175,5 t), 10 % | 100,61 tCO2e |
| département 28 (Eure-et-Loir, 58 416 t), 10 % | 33 489,89 tCO2e |
| département 75 (Paris, 17 415 t pour 1 ha de SAU), 10 % | 9 984,02 tCO2e |
| département 35 (Ille-et-Vilaine, 32 568 t), 10 % | 18 671,23 tCO2e |

Les valeurs sur données réelles sont recalculées hors du dépôt (Python, `Decimal`) à partir des CSV.

## Limites

| Limite | Effet |
|---|---|
| Livré n'est pas épandu | les livraisons sont comptées au département du distributeur : Paris reçoit 17 415 t d'azote pour 1 ha de SAU, les Hauts-de-Seine 7 367 t pour 5 ha, contre 58 416 t pour 446 392 ha en Eure-et-Loir ; limite assumée par le tableur |
| Une seule campagne au département | les valeurs bougent d'une campagne à l'autre : Nouvelle-Aquitaine 229 342 t en 2021-2022 puis 200 843 t en 2022-2023, Provence-Alpes-Côte d'Azur 12 873 t en 2021-2022 puis 23 455 t en 2022-2023 |
| Corse départementale | 2A et 2B sans résultat ; la région 94 est calculée (215 et 136 t) |
| Somme des départements et des régions | 1 746 534 t avec la Corse contre 1 746 521 t pour les 13 régions en 2021-2022 |
| Incertitude du facteur | 400 % dans la Base Empreinte |
| Pas de ventilation sous le département | l'EPCI n'est pas calculé |
| Métropole seulement | pas de calcul pour les départements d'outre-mer |
| Leviers du secteur | les leviers de l'agriculture s'additionnent sans interaction (feuille `SG Agriculture`) |
