# Transport de marchandises, report modal

Identifiant : `transport_marchandises_report_modal`. Niveau : région seulement. Les données, le taux de chargement, le facteur électrique et les hypothèses `heavyVehicleLoadFactor`, `heavyVehicleTripType` et `includeInternationalFlows` sont ceux du levier `transport_marchandises_sobriete_logistique` (`src/levers/transport-marchandises-sobriete-logistique/methodology.md`) ; les valeurs et leurs limites sont renvoyées dans `appliedAssumptions`, avec les facteurs ferroviaire et fluvial, les quatre coefficients et la cyclologistique par défaut. Métropole seule.

## Formule

```
Émissions évitées (tCO2e/an) = (t.km − t.km cyclologistique) ×
  { r_fer × (FE_TRM × 0,8064 − FE_TFM × 1,0164) + r_flu × (FE_TRM × 0,8176 − FE_TFlM × 0,9576) } ÷ 1 000
```

| Terme | Sens | Unité |
|---|---|---|
| `r_fer` | « Pourcentage de report modal de la route vers le ferroviaire (marchandises) », saisi | fraction des t.km routières |
| `r_flu` | « Pourcentage de report modal de la route vers le fluvial (marchandises) », saisi | fraction des t.km routières |
| `t.km cyclologistique` | « Tonnes.km de TRM passées de la route à des modes actifs », saisies, 0 par défaut | tonnes.kilomètres |
| `FE_TRM` | facteur mixte des poids lourds de la région (sobriété logistique) | kgCO2e par t.km |
| `FE_TFM` | facteur du train de marchandises | 0,007278 kgCO2e par t.km |
| `FE_TFlM` | facteur du transport fluvial | 0,0206283 kgCO2e par t.km |
| 0,8064 ; 1,0164 | route évitée et ferroviaire créé par t.km reportée vers le ferroviaire | sans unité |
| 0,8176 ; 0,9576 | route évitée et fluvial créé par t.km reportée vers le fluvial | sans unité |

La formule est lue dans les formes de la feuille `TrsptMarch_ReportModal` ; la cellule « Formule » ne contient que « Réduction GES = ». Le résultat du tableur est en kgCO2e ; il est divisé par 1 000.

**Appariement corrigé.** La forme dessinée multiplie `% RM TRM ferroviaire` par `FE TFlM` et `% RM TRM fluvial` par `FE TFM`, à l'inverse des coefficients du Scénario global (« tonnes.km ferré … × % de report vers le ferroviaire × 1,0164 » et « tonnes.km fluvial … × % de report vers le fluvial × 0,9576 ») : le ferroviaire prend `FE_TFM` et le fluvial `FE_TFlM` (correction 3 de `docs/methodology/formula-corrections.md`).

## Entrées

| Entrée | Unité | Bornes |
|---|---|---|
| `roadToRailFraction` | fraction des t.km routières | 0 à 1, obligatoire |
| `roadToWaterwayFraction` | fraction des t.km routières | 0 à 1, obligatoire |
| `cyclologisticTonneKilometres` | tonnes.kilomètres | positif ou nul, facultatif, 0 par défaut |

La somme des deux reports ne dépasse pas 100 % : le tableur n'en pose pas, la requête est refusée au-delà (choix de conception, non validé). Aucune valeur de la SNBC 3 (`ParametreDeterminants!H24:I25` sont vides). La cyclologistique n'est pas bornée par les t.km de la région : au-delà, la base devient négative et le résultat change de signe.

## Constantes

| Constante | Valeur | Source |
|---|---|---|
| 0,8064 ; 1,0164 ; 0,8176 ; 0,9576 | | `TrsptMarch_ReportModal` (formes et `B13`) : « issus de l'analyse du programme CEE REMOVE » ; introuvables dans les guides, FAQ et manuels REMOVE lus |
| `FE_TFM` | 0,007278 kgCO2e/t.km | Base Empreinte, élément 47691 « Train, motorisation moyenne, chargement moyen », France continentale : combustion 0,004715 + amont 0,002563 ; fabrication 0,002991 exclue ; `DonneesReference!D42` « avec prise en compte d'une part de l'amont » |
| `FE_TFlM` | 0,0206283 kgCO2e/t.km | `FE_fluvial!D25` : moyenne des six facteurs par classe de bateau, poste Combustion seul, pondérée par le nombre de bateaux de la flotte active VNF 2016 |

## Choix faits

| # | Choix | Source ou statut |
|---|---|---|
| 1 | Le ferroviaire prend `FE_TFM`, le fluvial `FE_TFlM` | correction 3 de `formula-corrections.md` ; appariement du Scénario global |
| 2 | `FE_TFM` : combustion et amont, sans fabrication ; `FE_TFlM` : combustion seule | `DonneesReference!D42` ; `FE_fluvial!D25` ; périmètres différents, renvoyés dans `appliedAssumptions` |
| 3 | La cyclologistique retire ses t.km de la base des reports, sans émission évitée créditée | forme dessinée ; en augmenter la valeur diminue la réduction |
| 4 | Somme des reports ≤ 100 % | choix de conception, non validé |
| 5 | `FE_TRM` mixte (sobriété logistique), pas le thermique seul | forme dessinée « FE TRM » |
| 6 | La correction 4 de `formula-corrections.md` (« 1 − % » du Scénario global) ne concerne pas ce levier | il calcule sa réduction seule, sur les t.km initiales |

## Cas de test chiffrés

| Entrée | Résultat |
|---|---|
| 1 000 000 t.km, route à 0,08, tout vers le ferroviaire | 57,1146408 tCO2e |
| idem, tout vers le fluvial | 45,65433992 tCO2e |
| idem, 10 % vers le ferroviaire et 5 % vers le fluvial | 7,994181076 tCO2e |
| idem, 400 000 t.km de cyclologistique, tout vers le ferroviaire | 34,26878448 tCO2e |
| route à 0,005, tout vers le ferroviaire | −3,3653592 tCO2e |
| région 84, jeu de test, 10 % et 5 % | 7,99 tCO2e |
| région 84, données réelles, 10 % et 5 % | 248 249,26 tCO2e |
| région 53 (Bretagne) | 106 147,13 tCO2e |
| région 11 (Île-de-France) | 165 986,06 tCO2e |
| région 94 (Corse) | 1 838,05 tCO2e |
| région 32 (Hauts-de-France) | 235 219,05 tCO2e |
| région 84, un milliard de t.km de cyclologistique | 240 308,58 tCO2e |
| région 94, un milliard de t.km de cyclologistique (plus que ses 0,235 milliard) | −5 967,19 tCO2e |

Les valeurs sur données réelles sont recalculées hors du dépôt (Python, `Decimal`) à partir des CSV.

## Limites

| Limite | Effet |
|---|---|
| Coefficients sans source accessible | 0,8064, 1,0164, 0,8176 et 0,9576 ne se retrouvent dans aucun document REMOVE lu |
| Périmètres de facteurs différents | fluvial : combustion seule ; ferroviaire : combustion et amont ; thermique routier : émissions directes OMINEA |
| Barges | 344 barges non motorisées (32 % des 1 088 bateaux) reçoivent les facteurs des automoteurs ; les 348 pousseurs sont comptés comme barges de 5 937,5 t |
| Cyclologistique sans effet positif | le paramètre retire des t.km de la base et ne crédite rien |
| Résultat négatif possible | si le mode reporté émet plus que la route évitée, ou si la cyclologistique dépasse les t.km ; aucune alerte renvoyée |
| Un seul facteur ferroviaire et fluvial | pour toutes les régions |
| Limites des données | celles de `transport_marchandises_sobriete_logistique` |
