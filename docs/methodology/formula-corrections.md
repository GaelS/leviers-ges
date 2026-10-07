# Corrections de formule

Le tableur ne calcule rien : ses formules sont dessinées dans des formes, la cellule « Formule » ne contient que « Réduction GES = ». Les cinq écarts ci-dessous sont corrigés dans le code. Ce ne sont pas des questions : la correction reste appliquée tant qu'elle n'est pas contredite.

## 1. Facteur divisé par le taux de remplissage ou de chargement

| | |
|---|---|
| Leviers | transport de personnes et de marchandises, les huit leviers |
| Tableur | la formule affichée multiplie le facteur par le taux de remplissage ou de chargement |
| Correction | on divise |
| Raison | l'unité l'impose (g par véhicule.km ÷ personnes par véhicule) ; la cellule `B15` de chaque onglet dit « diviser » |

```
facteur par passager.km = facteur par véhicule.km ÷ taux de remplissage
facteur par tonne.km    = facteur par véhicule.km ÷ taux de chargement
```

## 2. Baisses d'efficacité multipliées, non sommées

| | |
|---|---|
| Leviers | transport de personnes et de marchandises, efficacité |
| Tableur | `B13` dit « somme » des baisses (éco-conduite, chargement) ; la formule affichée les multiplie |
| Correction | produit, comme affiché |
| Raison | les résultats diffèrent : 15,9 % contre 16,6 % (10 % de passagers en plus, 50 % d'application, 15 % de potentiel) |

```
baisse totale =
  1 − 1 / (1 + % augmentation du nombre de passagers par véhicule)
        × (1 − % application de l'écoconduite × % potentiel de baisse par écoconduite)
```

## 3. Report modal des marchandises : facteur du bon mode

| | |
|---|---|
| Leviers | transport de marchandises, report modal |
| Tableur | chaque mode porte le facteur de l'autre |
| Correction | `FE TFM` pour le ferroviaire, `FE TFlM` pour le fluvial |
| Raison | le Scénario global applique « report ferroviaire × 1,0164 » et « report fluvial × 0,9576 » |

Formule du tableur :

```
% RM TRM ferroviaire × (FE TRM × 0,8064 − FE TFlM × 1,0164)
% RM TRM fluvial     × (FE TRM × 0,8176 − FE TFM  × 0,9576)
```

Formule corrigée :

```
% RM TRM ferroviaire × (FE TRM × 0,8064 − FE TFM  × 1,0164)
% RM TRM fluvial     × (FE TRM × 0,8176 − FE TFlM × 0,9576)
```

## 4. « 1 − % » dans le Scénario global

| | |
|---|---|
| Leviers | transport de marchandises (report modal, efficacité), déchets (les deux leviers), réseaux de chaleur |
| Tableur | plusieurs formes du Scénario global écrivent « % réduction × valeur » sans « 1 − » |
| Correction | `(1 − %) × valeur` |
| Raison | le pourcentage est une réduction : à 10 % de report, 8 % des tonnes-km resteraient au lieu de 92 % |

```
valeur restante = (1 − % de réduction) × valeur
```

## 5. Unité des facteurs de réseau de chaleur

| | |
|---|---|
| Leviers | bâtiments et machines agricoles, résidentiel (changement du système de chauffage, sobriété), réseaux de chaleur |
| Tableur | facteurs notés en « g éq. CO2/kWh » |
| Correction | kg par kWh |
| Raison | les deux sources donnent de 0 à 0,5, ce qui n'est possible qu'en kg par kWh |

```
unité du facteur de réseau de chaleur = kgCO2e/kWh
```

## Test attendu

Chaque correction a un cas chiffré dans la fiche de son levier (`docs/methodology/levers/<levier>.md`) : l'entrée, le résultat avec la formule du tableur, le résultat avec la formule corrigée. Le test du levier porte sur le résultat corrigé.
