# Points à arbitrer

Le tableur fait foi : toute interprétation nouvelle se signale. Ce registre rassemble les points que les 12 leviers déjà faits ont laissés ouverts. Il reprend les listes « À arbitrer » des PR, qui disparaissent de la vue après le merge. Le détail de chaque point (formule, chiffres, tests) est dans le `methodology.md` du levier ; ce registre dit seulement quoi faire valider, par qui, et ce que le choix actuel change.

Les hypothèses qui ont un nom et une valeur par défaut modifiable sont dans `assumptions.md`. Les formules corrigées par rapport au tableur sont dans `formula-corrections.md`. Les limites de données sans décision à prendre restent dans le `methodology.md` du levier.

| Statut | Sens |
|---|---|
| ADEME | la réponse de l'ADEME change la valeur ou le calcul |
| Conception | choix de ce dépôt, sans source, non validé |
| Erratum | erreur du tableur à lui remonter, le code ne dépend pas de la réponse |

Quand un point est tranché : la ligne passe en « résolu » avec la date et la décision, et le `methodology.md` du levier est mis à jour dans la même PR. Une nouvelle PR de levier ajoute ses lignes ici.

## Tous les leviers

| Point | Statut | Choix actuel | Effet |
|---|---|---|---|
| La cellule « Formule » est vide ; les formules sont lues dans les formes dessinées du classeur | ADEME | lecture des positions des formes du dessin | une forme mal lue change le résultat ; les ambiguïtés de lecture sont chacune une ligne ci-dessous |
| Une valeur négative dans un CSV (MWh, GWh, hectares, tonnes) passe la lecture sans contrôle | Conception | aucune borne (`require-column.ts`, partagé) ; les fichiers sont protégés par leur empreinte | un hectare négatif donnerait une part hors de 0 à 1 ; à décider une fois pour tous les leviers |
| Territoires d'outre-mer | Conception | absents de la plupart des jeux, ces leviers renvoient `missing_data` ; les déchets les incluent | résultat absent, pas faux |

## Agriculture et bois

| Levier | Point | Statut | Choix actuel | Effet |
|---|---|---|---|---|
| `batiments_machines_agricoles`, `residentiel_sobriete` | coefficient de 67,4 % sur le facteur de l'électricité, sans cellule ni explication | ADEME | repris tel quel | facteur 0,0533 au lieu de 0,0791 kgCO2e/kWh, soit −32,6 % sur l'électricité |
| `batiments_machines_agricoles` | pêche comprise dans les produits pétroliers du secteur | ADEME | comprise, comme le tableur | 9,0 % des produits pétroliers de métropole, 22 % en Bretagne |
| `batiments_machines_agricoles` | territoire sans réseau de chaleur | Conception | contribution de chaleur nulle (décision du 2026-10-08) | la chaleur agricole ne concerne que 15 communes |
| `batiments_machines_agricoles` | facteur du fioul lourd appliqué à tous les produits pétroliers | ADEME | fioul lourd, comme la forme | 4,5 % et 7,1 % de trop par rapport au gazole et à l'essence des engins agricoles (OMINEA) |
| `batiments_machines_agricoles` | produits pétroliers et chaleur répartis par la part de SAU | Conception | part de SAU du territoire dans chaque région | la part de SAU s'écarte de celle du gazole non routier de 3,0 points en médiane, 11,6 au 90e centile |
| `batiments_machines_agricoles` | somme des EPCI inférieure de 110 tCO2e aux 13 régions (produits pétroliers) | Conception | cause non établie | 110 sur 12 333 751 tCO2e |
| `haies` | rabais régionaux de la méthode (5 à 50 %, plus 10 % de non-permanence) | ADEME | non appliqués, comme le tableur | stockage surestimé hors Grand-Ouest |
| `produits_bois` | part départementale de la récolte en m³ prise pour part de la production de produits bois en tC | Conception | proxy | résultat départemental indicatif |
| `produits_bois` | hausse de production sans borne | ADEME | comme le tableur | une baisse donne un stockage négatif, une hausse de plus de 100 % est acceptée |
| `reseaux_chaleur` | deux sources de contenu CO2 pour un même réseau | Conception | France Chaleur Urbaine avant le SDES | pour 259 réseaux sur 821 l'écart dépasse 0,001 kgCO2e/kWh (29,9 % de l'énergie) |

## Résidentiel

| Levier | Point | Statut | Choix actuel | Effet |
|---|---|---|---|---|
| `residentiel_sobriete` | CEREN « pas disponible en open source » | ADEME | bilan SDES 2024 à la place | concorde avec le CEREN national à 5 % près ; le SDES est constaté, le CEREN à climat normal |
| `residentiel_sobriete` | répartition du fioul (80 %) et du GPL (20 %) | ADEME | part nationale du CEREN 2024 | un CEREN par région ou une autre clé change les deux vecteurs |
| `residentiel_sobriete` | fioul et GPL départementaux | ADEME | ligne régionale répartie au prorata des ventes 2024 de FOD et de GPL | ventes tous clients, unité non publiée : la Haute-Corse vend 27 fois la Corse-du-Sud |
| `residentiel_sobriete` | formule appliquée à la consommation initiale | Conception | consommation initiale du territoire | le scénario l'applique à la consommation restante après les deux autres leviers résidentiels |
| `residentiel_sobriete` | bois non compté | Conception | non compté, la forme ne le liste pas | `B13` dit « consommations énergétiques totales » |
| `residentiel_sobriete` | baisse de 0,1 par défaut du tableur (`F20`) | Conception | pas de valeur par défaut, comme les autres leviers | `appliedAssumptions` reste vide pour ce paramètre |
| `residentiel_sobriete` | gaz et fioul lus en PCI | Conception | PCI | les FE OMINEA sont par GJ PCI, le jeu ne dit pas PCS ou PCI |
| `residentiel_sobriete` | facteurs OMINEA arrondis à deux décimales | Conception | 55,88 et 74,52 | l'écart est inférieur à 0,01 % |
| `residentiel_sobriete` | départements et régions | Conception | électricité et gaz départementaux par le jeu IRIS, régionaux par le bilan | la somme des 96 départements dépasse celle des 13 régions de 1,1 % |
| `residentiel_sobriete` | paramètre rattaché au levier « Tertiaire », facteur du réseau en « g » alors qu'il est en kg, parc de logements listé hors formule | Erratum | pas de dépendance du code | trois constats à remonter (`Residentiel_Sobriete!A20`, `D33`, `A25`) |

## Transport de personnes

| Levier | Point | Statut | Choix actuel | Effet |
|---|---|---|---|---|
| `transport_personnes_efficacite` | potentiel d'écoconduite : 15 % pour les voitures et les bus | ADEME | 15 %, valeur unique du tableur (`DonneesReference!D29`, « ~15% ») | la page citée dit « jusqu'à 15 % » : un plafond pris pour une moyenne |
| `transport_personnes_efficacite` | hausse de passagers sans plafond | ADEME | comme le tableur | 200 % de passagers en plus donne 71,7 % de baisse |
| `transport_personnes_efficacite`, `_electrification`, `_report_modal`, `_sobriete_deplacements` | part du ferré des passagers.km de transport en commun | Conception | 82 % en Île-de-France, 24 % ailleurs (SDES), renvoyée avec sa limite | un territoire avec un grand métro hors Île-de-France a une part plus haute ; hypothèse sur le facteur du bus |
| `transport_personnes_efficacite` | facteurs d'émission des voitures issus d'un calcul d'essai non reproduit dans le dépôt | Conception | calcul de la fiche d'analyse | valeurs vérifiées par recalcul, non versionnées |
| `transport_personnes_electrification` | part supérieure à la part thermique du parc | Conception | plafonnée et renvoyée dans `appliedAssumptions` | refuser avec une erreur typée est possible |
| `transport_personnes_electrification` | sens de `x` | ADEME | part du parc entier, pas des seuls véhicules thermiques | le tableur ne tranche pas |
| `transport_personnes_electrification` | facteur électrique | Conception | amont seul, identique partout (`electricVehicleEmissionFactors`) | pas de mix électrique local |
| `transport_personnes_report_modal` | dernière ligne dessinée de la formule, `PK × 52,14 × r_actifs × FE_TC` | ADEME | ignorée (`passengerCarLastLineKept`) | +22 % si elle est gardée (région 84 : 207 826,72 contre 253 636,77 tCO2e) |
| `transport_personnes_report_modal`, `_sobriete_deplacements` | facteur du ferré | ADEME | 0,0229 amont seul, combustion supposée nulle ; 0,187 en Corse (`railElectricityUpstreamShare`) | si les TER diesel comptent, le gain du transport en commun baisse |
| `transport_personnes_report_modal` | somme des reports ≤ 100 % | ADEME | 100 % accepté | le tableur dit « inférieur », strict ou large non tranché |
| `transport_personnes_report_modal` | résultat négatif | Conception | possible, sans alerte | en Corse dès 55,6 % de ferré saisi |
| `transport_personnes_sobriete_deplacements` | une seule fraction pour la voiture et le transport en commun | ADEME | une fraction | le tableur ne donne qu'un paramètre |
| `transport_personnes_sobriete_deplacements` | passagers.km de transport en commun | Conception | comptés en entier, ferré et routier | l'efficacité ne compte que le routier |
| `transport_personnes_sobriete_deplacements` | facteur du bus ÷ 10 | Conception | par analogie avec la voiture ; `B15` ne cite que les voitures | le tableur annonce pourtant ses facteurs de bus en kgCO2e/passager |
| `transport_personnes_sobriete_deplacements` | 273 EPCI avec transport en commun mais sans bus classé | Conception | facteur national de bus pour leur part routière | à corriger en saisissant `railShareFraction` si le réseau est surtout ferré |

## Déchets

| Levier | Point | Statut | Choix actuel | Effet |
|---|---|---|---|---|
| `dechets_mode_de_traitement`, `dechets_sobriete` | tonnes des sites du territoire ou déchets du territoire (`wasteScope`) | ADEME | sites de traitement (IREP 2022) | un territoire sans site a un résultat nul : 911 EPCI sur 1 255, et Paris au niveau département |
| `dechets_mode_de_traitement`, `dechets_sobriete` | quelles tonnes pour chaque terme de la forme (le même libellé est écrit trois fois, ou deux) | Conception | tonnes du mode de départ du terme | cohérent avec `Scénario global Déchets` ; une autre lecture changerait les trois termes |
| `dechets_mode_de_traitement`, `dechets_sobriete` | correspondance entre codes d'opération et modes | Conception | stockage = D1, D5 et D10 ; incinération avec récupération = R1 | D10 pèse 1 207 376 t contre 61 517 t dans SINOE 2021 (19,6 fois) |
| `dechets_mode_de_traitement`, `dechets_sobriete` | codes sans facteur (terres et pierres 20 02 02, 8 codes) | Conception | terme non calculé, tonnes renvoyées dans `appliedAssumptions` | 28,2 % du stockage ignoré (région 84 : 51 700,6 t ; Île-de-France : 2 527 010,76 t) |
| `dechets_mode_de_traitement` | somme des deux parts du stockage ≤ 100 % | Conception | refusée au-delà | déduite du Scénario global, absente de `ParametreDeterminants` |
| `dechets_mode_de_traitement` | résultat négatif | Conception | possible, sans alerte | plastique : l'incinération émet plus que le stockage (2 769 contre 41 kgCO2e/t) |
| `dechets_sobriete` | cumul avec le changement de mode | ADEME | chaque levier seul sur les tonnes initiales | le tableur calcule les tonnes après sobriété puis les répartit selon les parts d'après changement ; la somme des deux diffère du cumul de `r` × (résultat du changement de mode) |
| `dechets_mode_de_traitement`, `dechets_sobriete` | arrondissements de Paris, Lyon et Marseille | Conception | rapportés à leur commune | comme les réseaux de chaleur |
| `dechets_mode_de_traitement`, `dechets_sobriete` | un seul millésime | Conception | 2022 | 2023 et 2024 sont publiés |

## Non concernés ici

Les leviers `pratiques_stockantes`, `occupation_des_sols`, `residentiel_renovation` et `residentiel_changement_systeme_chauffage` ne sont pas calculés ; leurs questions sont dans `assumptions.md`, section « Questions sans contournement ». Les six leviers calculables restants (fertilisation azotée, élevage durable, transport de marchandises) ajouteront leurs lignes à leur PR.
