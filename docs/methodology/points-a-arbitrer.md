# Points à arbitrer

Le tableur fait foi : toute interprétation nouvelle se signale. Ce registre rassemble les points que les 17 leviers faits ont laissés ouverts. Il reprend les listes « À arbitrer » des PR, qui disparaissent de la vue après le merge. Le détail de chaque point (formule, chiffres, tests) est dans le `methodology.md` du levier ; ce registre dit seulement quoi faire valider, par qui, et ce que le choix actuel change.

Les hypothèses nommées, avec leur valeur par défaut modifiable, sont dans `assumptions.md` ; ce registre en recoupe quelques-unes (`wasteScope`, `passengerCarLastLineKept`, `railElectricityUpstreamShare`). Les formules corrigées par rapport au tableur sont dans `formula-corrections.md`. Les limites de données sans décision à prendre restent dans le `methodology.md` du levier.

| Statut | Sens |
|---|---|
| ADEME | une question à poser à l'ADEME : le tableur se tait, se contredit ou ne l'explique pas, le dépôt a fait un choix en attendant et la réponse peut changer le résultat |
| Conception | un choix de ce dépôt, sans question à poser mais sans source : il se discute, il n'a pas été validé |
| Erratum | une erreur du tableur à lui remonter ; le code ne dépend pas de la réponse, sauf mention contraire |

Quand un point est tranché : la ligne passe en « résolu » avec la date et la décision, et le `methodology.md` du levier est mis à jour dans la même PR. Une nouvelle PR de levier ajoute ses lignes ici : un test (`src/documentation/points-a-arbitrer.spec.ts`) échoue si un levier implémenté n'est pas nommé par son identifiant complet, entre accents graves. Un levier sans point ouvert y est nommé avec la mention « aucun point ouvert ».

## Tous les leviers

| Point | Statut | Choix actuel | Effet |
|---|---|---|---|
| La cellule « Formule » ne contient que « Réduction GES = » ; les formules sont lues dans les formes dessinées du classeur | ADEME | lecture des positions des formes du dessin | une forme mal lue change le résultat ; les ambiguïtés de lecture sont chacune une ligne ci-dessous |
| Une valeur négative dans un CSV (MWh, GWh, hectares, tonnes) passe la lecture sans contrôle | Conception | aucune borne (`require-column.ts`, partagé) ; les fichiers sont protégés par leur empreinte | un hectare négatif donnerait une part hors de 0 à 1 ; à décider une fois pour tous les leviers |
| Territoires d'outre-mer | Conception | absents de la plupart des jeux, ces leviers renvoient `missing_data` ; les déchets les incluent | résultat absent, pas faux |
| Cumul des leviers d'un même secteur (feuilles `SG Agriculture`, `SG UTCATF`, `SG Résidentiel`, `Scénario global …`) | ADEME | chaque levier se calcule seul sur les valeurs initiales (correction 4 de `formula-corrections.md`) | le tableur enchaîne les leviers ; la somme des résultats diffère du scénario cumulé |

## Agriculture et bois

| Levier | Point | Statut | Choix actuel | Effet |
|---|---|---|---|---|
| `batiments_machines_agricoles`, `residentiel_sobriete` | coefficient de 67,4 % sur le facteur de l'électricité, sans cellule ni explication | ADEME | repris tel quel | facteur 0,0533 au lieu de 0,0791 kgCO2e/kWh, soit −32,6 % sur l'électricité |
| `batiments_machines_agricoles` | pêche comprise dans les produits pétroliers du secteur | ADEME | comprise, comme le tableur | 9,0 % des produits pétroliers de métropole, 22 % en Bretagne |
| `batiments_machines_agricoles` | territoire sans réseau de chaleur | ADEME | contribution de chaleur nulle (décision du 2026-10-08) | la chaleur agricole ne concerne que 15 communes |
| `batiments_machines_agricoles` | facteur du fioul lourd appliqué à tous les produits pétroliers | ADEME | fioul lourd, comme la forme | OMINEA donne 74,52 et 72,48 pour les engins agricoles : le fioul lourd (78) est 4,7 % et 7,6 % plus haut |
| `batiments_machines_agricoles` | produits pétroliers et chaleur répartis par la part de SAU | Conception | part de SAU du territoire dans chaque région | la part de SAU s'écarte de celle du gazole non routier de 3,0 points en médiane, 11,6 au 90e centile |
| `batiments_machines_agricoles` | somme des EPCI inférieure de 110 tCO2e aux 13 régions (produits pétroliers) | Conception | cause non établie | 110 sur 12 333 751 tCO2e |
| `fertilisation_azotee` | campagnes : moyenne de deux ans pour une région, une seule campagne pour un département (`nitrogenCampaigns`) | ADEME | 2021-2022 et 2022-2023 en région, 2021-2022 au département | le tableur demande la moyenne sur deux ans ; le rapport départemental 2022-2023 n'est pas publié |
| `fertilisation_azotee` | livré pris pour épandu | ADEME | livraisons, comme le tableur | Paris reçoit 17 415 t d'azote pour 1 ha de SAU |
| `fertilisation_azotee` | Corse départementale | Conception | 2A et 2B sans résultat (`missing_data`) | la Corse est publiée sous le code 20 sans distinguer 2A et 2B |
| `fertilisation_azotee` | facteur d'émission national, incertitude de 400 % | ADEME | 5,733 kgCO2e/kg d'azote pour tous les territoires | un facteur par territoire n'existe pas dans la Base Empreinte |
| `fertilisation_azotee` | borne de la réduction | ADEME | 0 à 1 | une ancienne note citait 25 % (surplus national d'azote, ClimAgri), absente du tableur actuel |
| `batiments_machines_agricoles` | gaz en PCS ou PCI | Conception | PCI | écart de 10 % sur 3,0 % de l'énergie du secteur |
| `batiments_machines_agricoles` | territoire sans SAU | Conception | produits pétroliers et chaleur nuls, électricité et gaz conservés, sans signal dans le résultat | région sans SAU (aucune en métropole), département ou EPCI urbain |
| `batiments_machines_agricoles` | secret statistique et communes sans ligne de SAU | Conception | lignes secrètes à 0 ; 1 384 communes sans SAU lues comme nulles | électricité : 38 % des lignes IRIS sous secret ; gaz : 66 % |
| `haies` | rabais régionaux de la méthode (5 à 50 %, plus 10 % de non-permanence) | ADEME | non appliqués, comme le tableur | stockage surestimé hors Grand-Ouest |
| `produits_bois` | part départementale de la récolte en m³ prise pour part de la production de produits bois en tC | Conception | proxy | résultat départemental indicatif |
| `produits_bois` | hausse de production sans borne | ADEME | comme le tableur | une baisse donne un stockage négatif, une hausse de plus de 100 % est acceptée |
| `produits_bois` | niveau EPCI non calculé | Conception | `not_computed` | la ventilation par la surface de forêt n'est pas vérifiable |
| `produits_bois` | bois d'industrie absent de la source pour 2A, 2B, 75, 93, 94 | Conception | compté 0, sans savoir si c'est zéro ou secret | 3 milliers de m³ sur 10 311 |
| `produits_bois` | sortie de stock des produits | Conception | supposée invariante, comme la formule | la hausse de production n'agit pas sur la sortie de stock |
| `produits_bois`, `reseaux_chaleur` | un seul millésime | Conception | 2022 pour la récolte de bois, 2024 pour les réseaux | 2024 existe pour les tC des produits bois, 2025 pour les réseaux |
| `reseaux_chaleur` | deux sources de contenu CO2 pour un même réseau | Conception | France Chaleur Urbaine avant le SDES | pour 259 réseaux sur 821 l'écart dépasse 0,001 kgCO2e/kWh (29,9 % de l'énergie) |
| `reseaux_chaleur` | livraisons SDES 2024 à la place de la bibliothèque FEDENE citée par le tableur (`G29`, derrière un formulaire) | ADEME | SDES | substitution de source |
| `reseaux_chaleur`, `residentiel_sobriete` | réseaux de froid, réseaux sous secret, imputation à la commune d'implantation, arrondissements | Conception | réseaux de froid conservés (27 réseaux, 418 577 MWh) ; 140 réseaux sous secret exclus (1,4 % de la production) ; réseau imputé à sa commune ; arrondissements rapportés à leur commune | un département servi par un réseau implanté ailleurs n'en reçoit pas la chaleur |
| `batiments_machines_agricoles` | trois séries d'énergie (régionale, IRIS, EPCI) qui ne se réconcilient pas | Conception | chacune sert à son niveau, on ne les additionne ni ne les compare | gaz local supérieur au gaz régional en PCS ; écart DROM de 38 125,283 MWh d'électricité |
| `batiments_machines_agricoles` | communes de la SAU absentes de la géographie | Conception | écartées sans erreur, hors de toute part | aucune aujourd'hui, un test fixe ce nombre à 0 ; un millésime futur qui en ajouterait casserait ce test |
| `fertilisation_azotee` | masse du territoire = masse livrée à la région ou au département, sans ventilation | ADEME | `ChgtPratiques!B13` : « à la maille régionale (à utiliser pour les régions) » ; aucune formule départementale n'est dessinée | le département applique la logique régionale |
| `fertilisation_azotee` | facteur d'émission de la France continentale appliqué à la Corse | Conception | même facteur partout, renvoyé dans `appliedAssumptions.nitrogenSpreadingEmissionFactor` | pas de facteur propre à la Corse |
| `fertilisation_azotee` | départements et régions non réconciliés | Conception | on ne les additionne pas | 1 746 534 t avec la Corse contre 1 746 521 t pour les 13 régions en 2021-2022 |
| `produits_bois` | régions et départements non réconciliés | Conception | arrondis de la source | écart de 3 milliers de m³ pour les départements ; les régions retombent sur le national |
| `produits_bois` | récolte nationale nulle non gérée | Conception | aucun contrôle | une récolte nationale à 0 dans `constants.csv` donnerait un résultat infini sans erreur ; la donnée versionnée vaut 19 975 et 10 311 |
| `reseaux_chaleur` | réseau dont la commune est absente de la géographie actuelle | Conception | facteur nul | 1 réseau (2515C, Goux-les-Usiers, commune fusionnée), sans effet |
| `reseaux_chaleur` | réseaux privés non recensés | Conception | non comptés | l'identification des réseaux n'est pas exhaustive |

## Élevage

| Levier | Point | Statut | Choix actuel | Effet |
|---|---|---|---|---|
| `elevage_durable` | niveau EPCI non calculé | Conception | `not_computed` (décision du 2026-10-20) | le fichier Agreste par EPCI se contredit sur les bovins (4,86 M de vaches laitières pour 3,48 M en France) et le secret retire 18 à 41 % des têtes ; la fiche d'analyse le jugeait faisable avec réserve |
| `elevage_durable` | formule lue dans le dessin : `(1 − b)` sur les déjections et le N2O | ADEME | dessin retenu | la prose du tableur est incohérente (`− b ×` pour le N2O, rien sur les déjections) et ne donne pas zéro quand rien ne change |
| `elevage_durable` | constantes OMINEA 2013 plutôt que 2026 | ADEME | 2013, comme `DonneesReference` | vache laitière : 121 contre 121,9 à 152,5 kg de CH4 ; excrétion azotée 115,6 contre 118,7 kg |
| `elevage_durable` | facteurs de la méthanisation (`methanisationFactors`) | ADEME | OMINEA 2026 pour les bovins et les porcins, indisponible pour les autres | une requête qui méthanise d'autres animaux est refusée |
| `elevage_durable` | borne de la baisse du facteur entérique | ADEME | 0 à 1 | `ParametreDeterminants!D9` annonce un encadrement sans le donner |
| `elevage_durable` | correspondance entre catégories du recensement agricole et types d'animaux | Conception | déduction par sommes et différences, secret = 0 | jusqu'à 1,3 % des volailles perdues dans 53 départements |
| `elevage_durable` | SV des bovins et lecture du tableau FCM | Conception | milieu des plages ; cellules fusionnées lues à la main | 3,79 et 1,96 kg par jour |
| `elevage_durable` | méthanisation initiale à 0 | ADEME | comme `ElevageDurable!B15` | l'OMINEA 2026 donne 9,5 % et 9,8 % pour les porcins |
| `elevage_durable` | animaux absents de la requête | Conception | inchangés, sans contribution | renvoyés dans `appliedAssumptions.unchangedAnimals` |
| `elevage_durable` | Paris absent du recensement agricole, outre-mer exclu | Conception | `missing_data` | pas de zéro inventé |
| `elevage_durable` | proportions actuelles de gestion des déjections nationales | ADEME | `DonneesTerritoires!H22` : « Nationale », renvoyées dans `appliedAssumptions.currentManureShares` | un territoire à dominante pâture ou lisier part des mêmes proportions |
| `elevage_durable` | lapines et ruches non comptées | Conception | aucun facteur dans le tableur | 422 790 lapines reproductrices en France |
| `elevage_durable` | effectifs au siège de l'exploitation | Conception | siège | un élevage sur deux départements est compté au siège |
| `elevage_durable` | vaches laitières de 21 départements sous secret | Conception | estimation de cartostat reprise, méthode non décrite | 91 et 93 sans valeur |
| `elevage_durable` | zones pédoclimatiques et millésime | Conception | non prises en compte (`ElevageDurable!B15`) ; un seul millésime, 2020 | pas de variation locale des facteurs |

## Transport de marchandises

| Levier | Point | Statut | Choix actuel | Effet |
|---|---|---|---|---|
| `transport_marchandises_sobriete_logistique` | niveaux département et EPCI hors périmètre | Conception | région seule | le tableur les déclare hors périmètre |
| `transport_marchandises_sobriete_logistique` | formule lue dans le dessin | ADEME | « Émissions évitées = % réduction × t.km × FE TRM » | la cellule « Formule » est vide |
| `transport_marchandises_sobriete_logistique` | taux de chargement des poids lourds (`heavyVehicleLoadFactor`) | ADEME | 8,1 t | 8,7 t en cible 2030 : −7 % sur le facteur par t.km |
| `transport_marchandises_sobriete_logistique` | courte ou longue distance, parc de la région (`heavyVehicleTripType`) | ADEME | longue distance | la courte distance donne un facteur de 32 % plus haut |
| `transport_marchandises_sobriete_logistique` | t.km avec ou sans l'étranger (`includeInternationalFlows`) | ADEME | avec l'étranger | 239,97 contre 171,71 milliards de t.km |
| `transport_marchandises_sobriete_logistique` | facteur thermique : CO2 seul, Euro choisi par Crit'Air, vignettes 1 à 5 seulement | Conception | OMINEA 2024, 3 à 14 % du parc diesel écarté | CH4 et N2O ajouteraient 1,7 % |
| `transport_marchandises_sobriete_logistique` | hydrogène et autres zéro émission avec l'électrique | Conception | facteur électrique (0,0467) | 907 poids lourds en métropole |
| `transport_marchandises_sobriete_logistique` | parc immatriculé dans la région | Conception | parc de la région | le parc circulant diffère |
| `transport_marchandises_efficacite` | potentiel d'écoconduite de 15 %, le même pour tous les poids lourds | ADEME | 15 % (`DonneesReference!D29`, « ~15% ») | la page citée dit « jusqu'à 15 % » ; le guide EVE de l'ADEME donne 5 à 15 % (10 % en moyenne) qui s'estompent |
| `transport_marchandises_efficacite` | deux effets combinés par produit | ADEME | produit, comme le dessin (correction 2) | `B13` dit « somme » : dans le cas de la correction 2 (10 % en plus, 50 %, 15 %) la somme donne 16,6 % de baisse et le produit 15,9 % |
| `transport_marchandises_efficacite` | hausse du chargement sans plafond | ADEME | acceptée à toute valeur positive | 200 % de chargement en plus donnent plus de 66 % de baisse avant écoconduite |
| `transport_marchandises_report_modal` | formule lue dans le dessin ; appariement des facteurs ferroviaire et fluvial | ADEME | ferroviaire avec `FE_TFM`, fluvial avec `FE_TFlM` (correction 3) | le dessin croise les deux facteurs ; les coefficients du Scénario global tranchent |
| `transport_marchandises_report_modal` | coefficients 0,8064, 1,0164, 0,8176, 0,9576 | ADEME | repris tels quels | introuvables dans les documents REMOVE lus |
| `transport_marchandises_report_modal` | facteurs ferroviaire (combustion et amont) et fluvial (combustion seule) | ADEME | 0,007278 et 0,0206283 kgCO2e/t.km | périmètres différents, une part de l'amont « non chiffrée » (`DonneesReference!D42`) |
| `transport_marchandises_report_modal` | somme des reports ≤ 100 % | Conception | refusée au-delà | le tableur ne pose pas de borne |
| `transport_marchandises_report_modal` | cyclologistique : base des reports sans crédit, non bornée | ADEME | 0 par défaut, négative au-delà des t.km de la région | en augmenter la valeur diminue la réduction |
| `transport_marchandises_electrification` | formule lue dans le dessin ; facteur thermique × taux de chargement dessiné | ADEME | division par le taux de chargement (correction 1) | la multiplication donnerait 5,2 kgCO2e/t.km au lieu de 0,080 : seule la division est cohérente avec `DonneesReference!D38` (facteur thermique en CO2e/véh.km) ; `C40` et `D27` libellent pourtant le facteur thermique « kgeqCO2/t.km », ce qui le dirait déjà par t.km |
| `transport_marchandises_electrification` | part saisie en points de parc supplémentaires, plafonnée à la part thermique | Conception | plafond renvoyé dans `appliedAssumptions` | `ParametreDeterminants!D41` ne donne pas de borne ; 0,15 % du parc (907 poids lourds sur 614 131) est déjà zéro émission |
| `transport_marchandises_electrification` | un seul facteur électrique pour tous les poids lourds | ADEME | 0,0467 kgCO2e/t.km (3,5 à 7,5 t, validité avril 2021, incertitude 70 %) | `DonneesReference!D39` le dit pour les véhicules entre 3,5 et 7 t |
| `transport_marchandises_electrification` | facteur thermique seul dans la formule, pas le mixte | ADEME | thermique, comme la forme dessinée | les autres leviers de marchandises prennent le mixte |
| `transport_marchandises_sobriete_logistique`, `_report_modal`, `_efficacite`, `_electrification` | biodiesel, t.km non rattachées, millésimes | Conception | biodiesel hors moyenne diesel ; t.km à région « non précisé » et DOM hors des 13 régions ; t.km 2024, parc 2024 (révisable), OMINEA 2024 | 2 485 poids lourds nationaux dans le parc mais pas dans la moyenne ; 6,7 milliards de t.km non rattachées |
| `transport_marchandises_efficacite`, `_report_modal` | `FE TRM` lu comme le facteur mixte (thermique et électrique), pas le thermique seul | ADEME | mixte, comme la sobriété logistique | l'électrification prend le thermique seul |
| `transport_marchandises_efficacite` | baisse des émissions égale à la baisse de consommation | Conception | comme la formule dessinée | hypothèse implicite de la formule, non vérifiée |
| `transport_marchandises_electrification` | t.km réparties uniformément entre les poids lourds | ADEME | la part de parc s'applique aux t.km, comme le tableur | hypothèse implicite du tableur, non vérifiée |
| `transport_marchandises_report_modal` | 344 barges non motorisées et 348 pousseurs | Conception | les barges reçoivent les facteurs des automoteurs ; les pousseurs sont comptés comme barges de 5 937,5 t (`FE_fluvial!B18:B23`) | 32 % des 1 088 bateaux |
| `transport_marchandises_report_modal` | un seul facteur ferroviaire et fluvial pour toutes les régions | Conception | national | pas de variation régionale |
| `transport_marchandises_report_modal`, `_electrification` | résultat négatif | Conception | possible, sans alerte | si le mode reporté émet plus que la route évitée, ou si la cyclologistique dépasse les t.km ; si le facteur électrique dépassait le thermique |

## Résidentiel

| Levier | Point | Statut | Choix actuel | Effet |
|---|---|---|---|---|
| `residentiel_sobriete` | CEREN « pas disponible en open source » | ADEME | bilan SDES 2024 à la place | concorde avec le CEREN national à 5 % près ; le SDES est constaté, le CEREN à climat normal |
| `residentiel_sobriete` | répartition du fioul (80 %) et du GPL (20 %) | ADEME | part nationale du CEREN 2024 | un CEREN par région ou une autre clé change les deux vecteurs |
| `residentiel_sobriete` | fioul et GPL départementaux | ADEME | ligne régionale répartie au prorata des ventes 2024 de FOD et de GPL | ventes tous clients, unité non publiée : la Haute-Corse vend 27 fois la Corse-du-Sud |
| `residentiel_sobriete` | formule appliquée à la consommation initiale | Conception | consommation initiale du territoire | le scénario l'applique à la consommation restante après les deux autres leviers résidentiels |
| `residentiel_sobriete` | bois non compté | Conception | non compté, la forme ne le liste pas | `B13` dit « consommations énergétiques totales » |
| `residentiel_sobriete` | département absent de l'extrait IRIS (gaz : 2A, 2B, 48) et territoire sans réseau | Conception | consommation et facteur de chaleur à 0 | 4 départements n'ont aucun réseau hors secret |
| `residentiel_sobriete` | secret statistique | Conception | lignes secrètes à 0 | électricité 2,6 %, gaz 5,3 % des lignes, 14 % des réseaux |
| `residentiel_sobriete` | baisse de 0,1 par défaut du tableur (`F20`) | Conception | pas de valeur par défaut, comme les autres leviers | `appliedAssumptions` reste vide pour ce paramètre |
| `residentiel_sobriete` | gaz et fioul lus en PCI | Conception | PCI | les FE OMINEA sont par GJ PCI, le jeu ne dit pas PCS ou PCI |
| `residentiel_sobriete` | facteurs OMINEA arrondis à deux décimales | Conception | 55,88 et 74,52 | l'écart est inférieur à 0,01 % |
| `residentiel_sobriete` | départements et régions | Conception | électricité et gaz départementaux par le jeu IRIS, régionaux par le bilan | la somme des 96 départements dépasse celle des 13 régions de 1,1 % |
| `residentiel_sobriete` | paramètre rattaché au levier « Tertiaire », facteur du réseau en « g » alors qu'il est en kg, parc de logements listé hors formule | Erratum | le facteur en kg/kWh est la correction 5 de `formula-corrections.md`, appliquée au code ; les deux autres n'ont pas d'effet | trois constats à remonter (`Residentiel_Sobriete!A20`, `D33`, `A25`) |
| `residentiel_sobriete` | année 2024 pour toutes les données | Conception | 2024 | le tableur ne fixe pas l'année des facteurs OMINEA |
| `residentiel_sobriete` | jeux IRIS agrégés hors dépôt | Conception | extraits déjà sommés par département, versionnés | le jeu IRIS résidentiel complet n'est pas versionné : la somme ne se reconstruit pas depuis le dépôt |
| `residentiel_sobriete` | chaleur : bilan pour la quantité, réseaux pour le facteur | Conception | chaleur régionale du bilan (14,7 TWh en métropole), facteur des réseaux hors secret (13,7 TWh) | les deux ensembles ne coïncident pas |

## Transport de personnes

| Levier | Point | Statut | Choix actuel | Effet |
|---|---|---|---|---|
| `transport_personnes_efficacite` | potentiel d'écoconduite : 15 % pour les voitures et les bus | ADEME | 15 %, valeur unique du tableur (`DonneesReference!D29`, « ~15% ») | la page citée dit « jusqu'à 15 % » : un plafond pris pour une moyenne |
| `transport_personnes_efficacite` | hausse de passagers sans plafond | ADEME | comme le tableur | 200 % de passagers en plus et 100 % d'application de l'écoconduite à 15 % donnent 71,7 % de baisse |
| `transport_personnes_efficacite`, `_electrification`, `_report_modal`, `_sobriete_deplacements` | part du ferré des passagers.km de transport en commun | Conception | 82 % en Île-de-France, 24 % ailleurs (SDES), renvoyée avec sa limite | un territoire avec un grand métro hors Île-de-France a une part plus haute ; hypothèse sur le facteur du bus |
| `transport_personnes_efficacite` | facteurs d'émission des voitures issus d'un calcul d'essai non reproduit dans le dépôt | Conception | calcul d'essai sur OMINEA v23.1 de la fiche d'analyse | non reproduit dans le dépôt |
| `transport_personnes_efficacite`, `_electrification` | facteur de bus : OMINEA 2024 (valeur basse) plutôt que Base Empreinte | Conception | 0,0805 kgCO2e/passager.km | Base Empreinte donne 0,0874 |
| `transport_personnes_efficacite` | EPCI à cheval sur l'Île-de-France | Conception | 24 % de ferré | l'EPCI 247800550 est à 89 % francilien |
| `transport_personnes_efficacite` | cinq errata à remonter | Erratum | seuls `B13` et `B15` correspondent à des corrections de formule | `ParametreDeterminants!B30:B33` (même abréviation pour deux paramètres), `DonneesReference!D29` (deux potentiels d'écoconduite pour une ligne), `TrsptPers_Efficacité!A37` (paramètre non utilisé) |
| `transport_personnes_electrification` | part supérieure à la part thermique du parc | Conception | plafonnée et renvoyée dans `appliedAssumptions` | refuser avec une erreur typée est possible |
| `transport_personnes_electrification` | sens de `x` | ADEME | part du parc entier, pas des seuls véhicules thermiques | le parc entier couvre aussi les trajets de plus de 100 km, hors du champ des passagers.km |
| `transport_personnes_electrification` | facteur électrique | Conception | amont seul, identique partout (`electricVehicleEmissionFactors`) | pas de mix électrique local |
| `transport_personnes_electrification` | gaz des voitures mis au-dessus de l'essence ; bus diesel à la valeur basse | Conception | choix 7 de la méthodologie | voir le `methodology.md` |
| `transport_personnes_electrification`, `_efficacite`, `_report_modal`, `_sobriete_deplacements` | taux de remplissage de 1,165 | ADEME | repris du tableur (motif « professionnel ») | les données sont des trajets domicile-travail |
| `transport_personnes_report_modal` | dernière ligne dessinée de la formule, `PK × 52,14 × r_actifs × FE_TC` | ADEME | ignorée (`passengerCarLastLineKept`) | +22 % si elle est gardée (région 84 : 207 826,72 contre 253 636,77 tCO2e) |
| `transport_personnes_report_modal`, `_sobriete_deplacements` | facteur du ferré | ADEME | 0,0229 amont seul, combustion supposée nulle ; 0,187 en Corse (`railElectricityUpstreamShare`) | si les TER diesel comptent, le gain du transport en commun baisse |
| `transport_personnes_report_modal` | somme des reports ≤ 100 % | ADEME | 100 % accepté | le tableur dit « inférieur », strict ou large non tranché |
| `transport_personnes_report_modal` | résultat négatif | Conception | possible, sans alerte | en Corse dès 55,6 % de ferré saisi |
| `transport_personnes_report_modal`, `_sobriete_deplacements` | territoire à cheval sur la Corse, ou sans commune connue | Conception | facteur ferré continental | 0,0229 au lieu de 0,187 |
| `transport_personnes_sobriete_deplacements` | une seule fraction pour la voiture et le transport en commun | ADEME | une fraction | le tableur ne donne qu'un paramètre |
| `transport_personnes_sobriete_deplacements` | passagers.km de transport en commun | Conception | comptés en entier, ferré et routier | l'efficacité ne compte que le routier |
| `transport_personnes_sobriete_deplacements` | facteur du bus ÷ 10 | Conception | par analogie avec la voiture ; `B15` ne cite que les voitures | le tableur annonce pourtant ses facteurs de bus en kgCO2e/passager |
| `transport_personnes_sobriete_deplacements` | 273 EPCI avec transport en commun mais sans bus classé | Conception | facteur national de bus pour leur part routière | à corriger en saisissant `railShareFraction` si le réseau est surtout ferré |
| `transport_personnes_efficacite`, `_electrification`, `_report_modal`, `_sobriete_deplacements` | périmètre des trajets : hexagone, moins de 100 km, domicile-travail, millésime 2022 | Conception | périmètre de la base, « Annuelle sans garantie » | 772 644 actifs métropolitains qui se déplacent hors champ ; DOM absents ; les autres motifs de déplacement ne sont pas comptés |
| `transport_personnes_efficacite`, `_electrification`, `_sobriete_deplacements` | deux-roues motorisés | Conception | sans terme | 1,4 % des passagers.km |
| `transport_personnes_efficacite`, `_electrification`, `_sobriete_deplacements` | parc de bus et cars immatriculé au siège | Conception | parc du territoire d'immatriculation | trois communes portent 17,7 % du parc métropolitain ; 276 des 1 243 EPCI n'ont aucun bus ni car classé et 11 aucune voiture : moyenne nationale en efficacité, résultat nul en électrification |
| `transport_personnes_efficacite` | carburants sans facteur | Conception | exclus de la moyenne du parc : « autre » pour les voitures, « essence » et « autre » pour les bus | la part exclue est renvoyée dans `appliedAssumptions` quand elle n'est pas nulle |
| `transport_personnes_efficacite`, `_electrification`, `_report_modal`, `_sobriete_deplacements` | passagers.km pour moitié côté résidence et pour moitié côté travail | ADEME | lecture de `TrsptPers_SobriétéDéplacements!B13` | hypothèse du tableur, non vérifiée par les données |
| `transport_personnes_report_modal`, `_sobriete_deplacements` | un seul facteur pour tout le ferré | Conception | national, ou corse | un territoire avec métro ou tram a son propre facteur, souvent plus bas |
| `transport_personnes_efficacite`, `_electrification`, `_report_modal`, `_sobriete_deplacements` | facteur du parc de voitures, pas celui du trajet | Conception | parc | les voitures d'un trajet donné diffèrent du parc moyen |
| `transport_personnes_report_modal` | report sans effet de capacité ni de distance | Conception | la fraction porte sur les passagers.km | aucune saturation du transport en commun ; les modes actifs ne couvrent pas les mêmes distances que la voiture |

## Déchets

| Levier | Point | Statut | Choix actuel | Effet |
|---|---|---|---|---|
| `dechets_mode_de_traitement`, `dechets_sobriete` | tonnes des sites du territoire ou déchets du territoire (`wasteScope`) | ADEME | sites de traitement (IREP 2022) | un territoire sans site a un résultat nul : 911 EPCI sur 1 255, et Paris au niveau département |
| `dechets_mode_de_traitement`, `dechets_sobriete` | quelles tonnes pour chaque terme de la forme (le même libellé est écrit trois fois, ou deux) | ADEME | tonnes du mode de départ du terme | cohérent avec `Scénario global Déchets` ; une autre lecture changerait les trois termes |
| `dechets_mode_de_traitement`, `dechets_sobriete` | correspondance entre codes d'opération et modes | Conception | stockage = D1, D5 et D10 ; incinération avec récupération = R1 | D10 pèse 1 207 376 t contre 61 517 t dans SINOE 2021 (19,6 fois) |
| `dechets_mode_de_traitement`, `dechets_sobriete` | codes sans facteur (terres et pierres 20 02 02, 8 codes) | Conception | terme non calculé, tonnes renvoyées dans `appliedAssumptions` | 28,2 % du stockage ignoré (région 84 : 51 700,6 t ; Île-de-France : 2 527 010,76 t) |
| `dechets_mode_de_traitement` | somme des deux parts du stockage ≤ 100 % | Conception | refusée au-delà | déduite du Scénario global, absente de `ParametreDeterminants` |
| `dechets_mode_de_traitement` | résultat négatif | Conception | possible, sans alerte | plastique : l'incinération émet plus que le stockage (2 769 contre 41 kgCO2e/t) |
| `dechets_sobriete` | cumul avec le changement de mode | ADEME | chaque levier seul sur les tonnes initiales | le tableur calcule les tonnes après sobriété puis les répartit selon les parts d'après changement ; la somme des deux diffère du cumul de `r` × (résultat du changement de mode) |
| `dechets_mode_de_traitement`, `dechets_sobriete` | arrondissements de Paris, Lyon et Marseille | Conception | rapportés à leur commune | comme les réseaux de chaleur |
| `dechets_mode_de_traitement`, `dechets_sobriete` | un seul millésime | Conception | 2022 | 2023 et 2024 sont publiés |
| `dechets_mode_de_traitement`, `dechets_sobriete` | récupération d'énergie non créditée, valorisation matière à zéro | ADEME | comme le tableur (`ChangementModeTraitement!B13`) | limites assumées par le tableur |
| `dechets_sobriete` | réduction à la source | Conception | retire des tonnes au mode de traitement actuel du territoire | ne dit pas où vont les déchets évités |
| `dechets_sobriete` | deux réductions indépendantes, sans plafond | Conception | 0 à 100 % chacune | aucune borne dans le tableur |

## Niveaux non calculés

Une ligne par cellule `not_computed` du registre `src/domain/lever-registry.ts` : un test échoue si une cellule n'a pas sa raison ici.

| Levier | Niveaux | Raison | Statut | Détail |
|---|---|---|---|---|
| `fertilisation_azotee` | EPCI | les livraisons d'azote sont publiées par département : pas de ventilation sous le département | Conception | `methodology.md` du levier, limites |
| `elevage_durable` | EPCI | le fichier Agreste par EPCI se contredit sur les bovins (4,86 M de vaches laitières pour 3,48 M en France) et le secret retire 18 à 41 % des têtes ; décision du 2026-10-20 | Conception | section Élevage |
| `produits_bois` | EPCI | la récolte de bois n'existe pas à cette maille ; la ventilation par la surface de forêt n'est pas vérifiable | Conception | section Agriculture et bois |
| `residentiel_sobriete` | EPCI | le fioul et le GPL résidentiels n'existent pas à cette maille | Conception | `methodology.md` du levier |
| `transport_marchandises_sobriete_logistique` | département, EPCI | le tableur déclare ces niveaux hors périmètre ; les données sont régionales | Conception | section Transport de marchandises |
| `transport_marchandises_report_modal` | département, EPCI | idem | Conception | section Transport de marchandises |
| `transport_marchandises_efficacite` | département, EPCI | idem | Conception | section Transport de marchandises |
| `transport_marchandises_electrification` | département, EPCI | idem | Conception | section Transport de marchandises |
| `pratiques_stockantes` | région, département, EPCI | le périmètre de validité est « LIMITEE » à chaque maille, sans commentaire ni surface applicable | ADEME | `assumptions.md` |
| `occupation_des_sols` | région, département, EPCI | l'unité du facteur de conversion n'est pas tranchée (tCO2e/ha/an ou variation totale) : le résultat varie jusqu'à 20 fois | ADEME | `assumptions.md`, questions sans contournement |
| `residentiel_renovation` | région, département, EPCI | la consommation par m² avant rénovation est renvoyée au CEREN, « Pas disponible en open source » | ADEME | `assumptions.md`, questions sans contournement |
| `residentiel_changement_systeme_chauffage` | région, département, EPCI | l'énergie livrée au seul chauffage et les rendements du GPL et des pompes à chaleur manquent | ADEME | `assumptions.md`, questions sans contournement |

## Non concernés ici

Les leviers `pratiques_stockantes`, `occupation_des_sols`, `residentiel_renovation` et `residentiel_changement_systeme_chauffage` ne sont pas calculés ; leurs questions sont dans `assumptions.md`, section « Questions sans contournement », et résumées dans « Niveaux non calculés ». Les 17 leviers calculables sont faits : toute nouvelle PR de levier ou de niveau ajoute ses lignes ici.
