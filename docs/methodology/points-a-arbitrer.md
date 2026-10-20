# Points à arbitrer

Le tableur fait foi : toute interprétation nouvelle se signale. Ce document dit, levier par levier, où le calcul est possible, ce qui débloquerait les niveaux non calculés et ce qui affinerait les calculs existants. Il constate ; il ne décide rien.

✅ calculé, aucune question ouverte. ❓ calculé grâce à une hypothèse nommée (`docs/methodology/assumptions.md`) ou à un choix décrit en partie 2. ❌ non calculé, raison en partie 1.

## Vue d'ensemble

| Secteur | Levier | Région | Département | EPCI |
|---|---|---|---|---|
| Agriculture et bois | Bâtiments et machines agricoles (`batiments_machines_agricoles`) | ✅ | ✅ | ✅ |
|   | Fertilisation azotée (`fertilisation_azotee`) | ❓ | ❓ | ❌ |
|   | Élevage durable (`elevage_durable`) | ❓ | ❓ | ❌ |
|   | Haies (`haies`) | ✅ | ✅ | ✅ |
|   | Produits bois (`produits_bois`) | ✅ | ✅ | ❌ |
|   | Pratiques stockantes (`pratiques_stockantes`) | ❌ | ❌ | ❌ |
|   | Changement d'occupation des sols (`occupation_des_sols`) | ❌ | ❌ | ❌ |
| Énergie et résidentiel | Réseaux de chaleur (`reseaux_chaleur`) | ✅ | ✅ | ✅ |
|   | Résidentiel, sobriété (`residentiel_sobriete`) | ✅ | ✅ | ❌ |
|   | Résidentiel, rénovation (`residentiel_renovation`) | ❌ | ❌ | ❌ |
|   | Résidentiel, changement du système de chauffage (`residentiel_changement_systeme_chauffage`) | ❌ | ❌ | ❌ |
| Transport de personnes | Sobriété des déplacements (`transport_personnes_sobriete_deplacements`) | ❓ | ❓ | ❓ |
|   | Report modal (`transport_personnes_report_modal`) | ❓ | ❓ | ❓ |
|   | Efficacité (`transport_personnes_efficacite`) | ✅ | ✅ | ✅ |
|   | Électrification (`transport_personnes_electrification`) | ❓ | ❓ | ❓ |
| Transport de marchandises | Sobriété logistique (`transport_marchandises_sobriete_logistique`) | ❓ | ❌ | ❌ |
|   | Report modal (`transport_marchandises_report_modal`) | ❓ | ❌ | ❌ |
|   | Efficacité (`transport_marchandises_efficacite`) | ❓ | ❌ | ❌ |
|   | Électrification (`transport_marchandises_electrification`) | ❓ | ❌ | ❌ |
| Déchets | Changement de mode de traitement (`dechets_mode_de_traitement`) | ❓ | ❓ | ❓ |
|   | Sobriété (`dechets_sobriete`) | ❓ | ❓ | ❓ |

Calculés : 17 leviers sur 21 en région, 13 en département, 9 en EPCI.

Quand un point est tranché, sa ligne est retirée ou mise à jour, et le `methodology.md` du levier est corrigé dans la même PR. Une nouvelle PR de levier ajoute ses lignes en partie 2, et en partie 1 pour chaque niveau qu'elle ne calcule pas. Les formules corrigées par rapport au tableur sont dans `formula-corrections.md`.

---

## 1. Niveaux non calculés : ce qui les débloquerait

### 1.1 Leviers non calculés à aucun niveau (4 leviers, 12 niveaux)

| Levier | Niveaux | Ce qui manque | Ordre de grandeur de l'enjeu |
|---|---|---|---|
| `pratiques_stockantes` | région, département, EPCI | le périmètre de validité est « LIMITEE » à chaque niveau, sans commentaire ni surface applicable | levier entier |
| `occupation_des_sols` | région, département, EPCI | l'unité du facteur de conversion : par an (tCO2e/ha/an) ou variation totale (tCO2e/ha) | le résultat varie jusqu'à 20 fois |
| `residentiel_renovation` | région, département, EPCI | la consommation par m² avant rénovation, par type de logement, chauffage et période de construction, par département (renvoyée au CEREN, « pas disponible en open source ») | levier entier |
| `residentiel_changement_systeme_chauffage` | région, département, EPCI | l'énergie livrée au seul chauffage, par département et par énergie ; les rendements du GPL et des pompes à chaleur (lien CSTB-ADEME mort) | levier entier |

### 1.2 Leviers calculés à certains niveaux seulement (12 niveaux)

| Levier | Niveaux à débloquer | Ce qui manque | Ce que le tableur dit |
|---|---|---|---|
| `fertilisation_azotee` | EPCI | des livraisons d'azote sous le département, ou la validation d'une ventilation par la surface de culture hors bio (rapport territoire/département, forme du tableur) | `LIMITEE` |
| `elevage_durable` | EPCI | un fichier d'effectifs par EPCI cohérent : celui d'Agreste se contredit sur les bovins (4,86 M de vaches laitières pour 3,48 M en France) et le secret retire 18 à 41 % des têtes | EPCI : OUI |
| `produits_bois` | EPCI | une récolte de bois à l'EPCI, ou la validation de la ventilation par la surface de forêt (`S_forêt_EPCI / S_forêt_dép`) | `LIMITEE` |
| `residentiel_sobriete` | EPCI | le fioul et le GPL résidentiels à l'EPCI, ou une clé de répartition validée | EPCI : OUI |
| `transport_marchandises_sobriete_logistique` | département, EPCI | les tonnes.kilomètres rapportées au département et à l'EPCI (les données sont régionales) ; le tableur déclare ces niveaux hors périmètre | hors périmètre |
| `transport_marchandises_report_modal` | département, EPCI | les tonnes.kilomètres rapportées au département et à l'EPCI (les données sont régionales) | hors périmètre |
| `transport_marchandises_efficacite` | département, EPCI | les tonnes.kilomètres rapportées au département et à l'EPCI (les données sont régionales) | hors périmètre |
| `transport_marchandises_electrification` | département, EPCI | les tonnes.kilomètres rapportées au département et à l'EPCI (les données sont régionales) | hors périmètre |

---

## 2. Ce qui affinerait les calculs existants

Pour chaque levier : le point, ce que nous faisons aujourd'hui, ce qui l'affinerait, et l'écart mesuré quand il existe. Les leviers sans ligne n'ont pas de point chiffré.

### Bâtiments et machines agricoles (`batiments_machines_agricoles`, région, département, EPCI)

| Point | Aujourd'hui | Ce qui l'affinerait | Écart |
|---|---|---|---|
| Coefficient de 67,4 % sur le facteur de l'électricité | repris tel quel, sans explication | l'origine du coefficient | facteur 0,0533 au lieu de 0,0791 kgCO2e/kWh, soit −32,6 % sur l'électricité |
| Pêche comprise dans les produits pétroliers | comprise, comme le tableur | la part agricole seule | 9,0 % des produits pétroliers de métropole, 22 % en Bretagne |
| Facteur du fioul lourd pour tous les produits pétroliers | fioul lourd (78) | le facteur des engins agricoles | OMINEA : 74,52 et 72,48, soit 4,5 % et 7,1 % de moins |
| Produits pétroliers répartis par la part de SAU | part de SAU | la part de gazole non routier | écart de 3,0 points en médiane, 11,6 au 90e centile |
| Secret statistique | lignes secrètes à 0 | les valeurs sous secret | électricité : 38 % des lignes IRIS ; gaz : 66 % |
| Maille des produits pétroliers | région répartie par la SAU | la donnée départementale que désigne le tableur (`H25`) | non chiffré |
| Millésime | 2024 | le millésime 2023 du tableur pour les produits pétroliers et la chaleur régionaux | non chiffré |
| Territoire sans réseau de chaleur | contribution nulle | un facteur de chaleur de repli | la chaleur agricole ne concerne que 15 communes |
| Gaz en PCS ou PCI | PCI | la précision du jeu | écart de 10 % sur 3,0 % de l'énergie du secteur |

### Fertilisation azotée (`fertilisation_azotee`, région, département)

| Point | Aujourd'hui | Ce qui l'affinerait | Écart |
|---|---|---|---|
| Une seule campagne au département | 2021-2022 | le rapport départemental 2022-2023 (non publié) | Nouvelle-Aquitaine 229 342 t puis 200 843 t ; Provence-Alpes-Côte d'Azur 12 873 t puis 23 455 t |
| Livré pris pour épandu | livraisons au département du distributeur | des épandages | Paris reçoit 17 415 t d'azote pour 1 ha de SAU |
| Facteur d'émission national | 5,733 kgCO2e/kg pour tous | un facteur par territoire | incertitude de 400 % |
| Corse départementale | 2A et 2B sans résultat | une publication distinguant 2A et 2B | la Corse est publiée sous le code 20 |

### Élevage durable (`elevage_durable`, région, département)

| Point | Aujourd'hui | Ce qui l'affinerait | Écart |
|---|---|---|---|
| Constantes OMINEA 2013 | 2013, comme le tableur | OMINEA 2026 | vache laitière : 121 contre 121,9 à 152,5 kg de CH4 ; excrétion azotée 115,6 contre 118,7 kg |
| Méthanisation initiale à 0 | 0, comme le tableur | la part initiale | OMINEA 2026 : 9,5 % des truies, 9,8 % des autres porcins |
| Méthanisation des autres animaux | refusée | des facteurs pour caprins, ovins, équins, volailles | aucun facteur disponible |
| Répartition actuelle des déjections nationale | OMINEA 2013 | une répartition par territoire | un territoire à dominante pâture ou lisier part des mêmes proportions |
| Effectifs au siège de l'exploitation | siège | l'effectif réel | un élevage sur deux départements est compté au siège |
| Secret statistique | une catégorie secrète vaut 0 | les valeurs | 0,2 % des volailles des régions, jusqu'à 1,3 % dans 53 départements |
| Vaches laitières de 21 départements sous secret | estimation de cartostat, méthode non décrite | une méthode documentée | 91 et 93 sans valeur |
| Lapines et ruches | non comptées | des facteurs | 422 790 lapines reproductrices en France |
| SV des bovins | milieu de la plage | la valeur retenue par l'inventaire | 3,79 et 1,96 kg par jour |
| Zones pédoclimatiques, millésime | non prises en compte, 2020 | un millésime plus récent et des facteurs locaux | non chiffré |

### Haies (`haies`, région, département, EPCI)

| Point | Aujourd'hui | Ce qui l'affinerait | Écart |
|---|---|---|---|
| Rabais régionaux de la méthode | non appliqués, comme le tableur | rabais de 5 à 50 % et 10 % de non-permanence | stockage surestimé hors Grand-Ouest |

### Produits bois (`produits_bois`, région, département)

| Point | Aujourd'hui | Ce qui l'affinerait | Écart |
|---|---|---|---|
| Part de la récolte en m³ prise pour part de la production en tC | proxy | la production de produits bois par département | résultat départemental indicatif |
| Sortie de stock supposée invariante | invariante | l'effet de la hausse de production | non chiffré |
| Bois d'industrie absent pour 2A, 2B, 75, 93, 94 | compté 0 | les valeurs | 3 milliers de m³ sur 10 311 |
| Millésime | 2022 | 2024 existe pour les tC | non chiffré |
| Source des tC | OMINEA 2026 | l'OMINEA 2025 citée par le tableur (tableau 83, p. 131) | non chiffré |
| Hausse sans borne | acceptée | une borne | une baisse donne un stockage négatif |

### Réseaux de chaleur (`reseaux_chaleur`, région, département, EPCI)

| Point | Aujourd'hui | Ce qui l'affinerait | Écart |
|---|---|---|---|
| Deux sources de contenu CO2 | France Chaleur Urbaine avant SDES | une source unique | écart supérieur à 0,001 kgCO2e/kWh pour 259 réseaux sur 821 (29,9 % de l'énergie) |
| Source des livraisons | SDES 2024 | la bibliothèque FEDENE citée par le tableur (`G29`, derrière un formulaire) | substitution de source |
| Réseaux sous secret | exclus | les valeurs | 140 réseaux, 1,4 % de la production |
| Réseaux privés non recensés | non comptés | un recensement exhaustif | non chiffré |
| Imputation à la commune d'implantation | commune du réseau | la commune des clients | un département servi par un réseau implanté ailleurs n'en reçoit pas la chaleur |
| Millésime | 2024 | 2025 est publié | non chiffré |

### Résidentiel, sobriété (`residentiel_sobriete`, région, département)

| Point | Aujourd'hui | Ce qui l'affinerait | Écart |
|---|---|---|---|
| CEREN indisponible | bilan SDES 2024 | le CEREN | concorde à 5 % près au national ; le SDES est constaté, le CEREN à climat normal |
| Répartition fioul 80 % / GPL 20 % | part nationale du CEREN 2024 | un CEREN par région ou une autre clé | change les deux vecteurs |
| Fioul et GPL départementaux | ventes 2024 de FOD et GPL | les consommations | ventes tous clients, unité non publiée : la Haute-Corse vend 27 fois la Corse-du-Sud |
| Bois non compté | non compté | sa consommation | non chiffré |
| Secret statistique | lignes secrètes à 0 | les valeurs | électricité 2,6 %, gaz 5,3 % des lignes, 14 % des réseaux |
| Coefficient de 67,4 % | repris tel quel | son origine | −32,6 % sur l'électricité |
| Formule appliquée à la consommation initiale | consommation initiale | la consommation restante après les deux autres leviers résidentiels | non chiffré |
| Départements et régions | sources différentes | une source commune | la somme des 96 départements dépasse celle des 13 régions de 1,1 % |

### Transport de personnes (`transport_personnes_sobriete_deplacements`, `transport_personnes_report_modal`, `transport_personnes_efficacite`, `transport_personnes_electrification`)

| Point | Leviers concernés | Aujourd'hui | Ce qui l'affinerait | Écart |
|---|---|---|---|---|
| Taux de remplissage de 1,165 | les quatre | motif « professionnel » (SDES) | le motif domicile-travail | les données sont des trajets domicile-travail |
| Potentiel d'écoconduite | efficacité | 15 % unique | une moyenne et non un plafond | le résultat lui est proportionnel |
| Part du ferré par défaut | les quatre | 82 % en Île-de-France, 24 % ailleurs | une part par territoire | l'EPCI 247800550 est à 89 % francilien et prend 24 % |
| Facteur du ferré | report modal, sobriété | amont seul, combustion nulle ; 0,187 en Corse | le périmètre exact | si les TER diesel comptent, le gain baisse |
| Facteur des voitures | les quatre | parc, calcul d'essai non reproduit | le facteur du trajet, un calcul reproduit | non chiffré |
| Pondération Crit'Air | efficacité, électrification | un facteur national par carburant | une pondération par territoire | non chiffré |
| Bus en CO2 seul | efficacité, électrification | OMINEA 2024, CO2 seul, valeur basse | CH4 et N2O, Base Empreinte | 0,0874 contre 0,0805 kgCO2e/passager.km |
| Parc de bus et cars immatriculé au siège | efficacité, électrification, sobriété | siège | le parc circulant | trois communes portent 17,7 % du parc ; 276 des 1 243 EPCI sans bus classé |
| Trajets de moins de 100 km, domicile-travail | les quatre | périmètre de la base | autres motifs et longues distances | 772 644 actifs métropolitains hors champ ; DOM absents |
| Deux-roues motorisés | efficacité, électrification, sobriété | sans terme | un terme | 1,4 % des passagers.km |
| Dernière ligne dessinée du report modal | report modal | ignorée | sa signification | +22 % si gardée (région 84) |
| Électrification : sens de `x` | électrification | part du parc entier | part des véhicules thermiques | le parc entier couvre aussi les trajets de plus de 100 km |
| Facteur électrique | électrification | amont seul, identique partout | le mix local | non chiffré |
| Facteur du bus ÷ 10 | sobriété | par analogie avec la voiture | la cellule pour les bus | non chiffré |
| 273 EPCI avec transport en commun sans bus classé | sobriété | facteur national de bus | leur parc réel | un réseau surtout ferré est chiffré au facteur du bus |

### Transport de marchandises (`transport_marchandises_sobriete_logistique`, `transport_marchandises_report_modal`, `transport_marchandises_efficacite`, `transport_marchandises_electrification`)

| Point | Leviers concernés | Aujourd'hui | Ce qui l'affinerait | Écart |
|---|---|---|---|---|
| Taux de chargement des poids lourds | les quatre | 8,1 t (2019) | la valeur SNBC 3 | 8,7 t en 2030 : −7 % sur le facteur par t.km |
| Courte ou longue distance | les quatre | longue distance | le trajet réel | la courte distance donne un facteur de 32 % plus haut |
| Flux avec l'étranger | les quatre | avec l'étranger | la définition du tableur | 239,97 contre 171,71 milliards de t.km |
| Poids lourds non diesel au facteur diesel | les quatre | diesel | un facteur par carburant | 10 462 au gaz (1,70 %), 500 à l'essence (0,08 %), 209 « inconnu » |
| Biodiesel, vignettes sans correspondance | les quatre | écartés de la moyenne | leur facteur | 2 485 poids lourds biodiesel ; 3 à 14 % du parc diesel d'une région |
| CO2 seul | les quatre | CO2 | CH4 et N2O | environ +1,7 % |
| Parc immatriculé, pas circulant | les quatre | parc de la région | le parc circulant | non chiffré |
| T.km non rattachées | les quatre | hors des 13 régions | leur rattachement | 6,7 milliards de t.km et celles des DOM |
| Hydrogène avec l'électrique | les quatre | facteur électrique | un facteur propre | 907 poids lourds en métropole |
| Coefficients 0,8064 / 1,0164 / 0,8176 / 0,9576 | report modal | repris tels quels | leur source | introuvables dans les documents REMOVE lus |
| Facteurs ferroviaire et fluvial | report modal | périmètres différents | des périmètres identiques | une part de l'amont « non chiffrée » |
| Barges et pousseurs | report modal | facteurs des automoteurs | des facteurs par type | 344 barges (32 % des 1 088 bateaux) |
| Potentiel d'écoconduite de 15 % | efficacité | 15 % pour tous les poids lourds | des gains par type d'activité | le guide EVE donne 5 à 15 % (10 % en moyenne) qui s'estompent |
| Un seul facteur électrique | électrification | 0,0467, validité avril 2021 | un facteur par catégorie | incertitude de 70 % ; valable de 3,5 à 7,5 t |
| Part électrifiée plafonnée | électrification | plafonnée à la part thermique | une règle du tableur | 0,15 % du parc est déjà zéro émission |
| T.km réparties uniformément entre les poids lourds | électrification | uniforme | une répartition réelle | non chiffré |

### Déchets (`dechets_mode_de_traitement`, `dechets_sobriete`)

| Point | Leviers concernés | Aujourd'hui | Ce qui l'affinerait | Écart |
|---|---|---|---|---|
| Tonnes des sites ou déchets du territoire | les deux | sites de traitement (IREP 2022) | les déchets collectés | 911 EPCI sur 1 255 sans site ont un résultat nul ; Paris au département |
| Terres et pierres sans facteur | les deux | terme non calculé | un facteur pour 20 02 02 | 28,2 % du stockage ; région 84 : 51 700,6 t ; Île-de-France : 2 527 010,76 t |
| Incinération sans récupération (D10) | les deux | comptée avec le stockage | une séparation | 1 207 376 t contre 61 517 t dans SINOE 2021 (19,6 fois) |
| Facteurs d'une famille voisine | les deux | 23 codes sur 35 | des facteurs propres | non chiffré |
| Récupération d'énergie non créditée | les deux | zéro, comme le tableur | un crédit | limite assumée par le tableur |
| Un seul millésime | les deux | 2022 | 2023 ou 2024 | publiés |
| Arrondissements de Paris, Lyon, Marseille | les deux | rapportés à leur commune | l'arrondissement | non chiffré |
| Cumul avec le changement de mode | sobriété | chaque levier seul | l'enchaînement du tableur | la somme des deux diffère du cumul |

---

## 3. Points qui affinent tous les leviers

| Point | Aujourd'hui | Ce qui l'affinerait |
|---|---|---|
| Cumul des leviers d'un même secteur (feuilles `SG …`, `Scénario global …`) | chaque levier seul sur les valeurs initiales | l'enchaînement du tableur (« 1 − % ») |
| Outre-mer | absent de la plupart des jeux | des jeux couvrant les DOM |
| Valeurs sans source dans le classeur | 0,0791, 55,88, 78, 5,733, 1,17, 1,165, 0,0229, 0,187, 0,0467, 8,1, 0,007278 | une vérification contre leurs sources externes (Base Empreinte, OMINEA, SDES) |
| Valeurs négatives dans les CSV | aucune borne | un contrôle commun |
| Bornes et défauts des paramètres | 0 à 1 pour les fractions, 0 ou plus pour les hausses, obligatoires sans défaut ; `ParametreDeterminants` n'a aucune borne et ses colonnes H et I sont vides, sauf `I8` et `I9` (0) et `I49` (0,1) ; `ElevageDurable!F19:F21` et `ProduitsBois!F19` affichent 0 par une recherche dans cette feuille, y compris sur des cellules vides | des bornes et des défauts donnés par le tableur |

---

## 4. Erreurs apparentes du tableur

Une ligne par constat sur une cellule ou une forme du classeur. Le code ne dépend pas de la réponse, sauf mention.

| Levier | Cellule | Constat | Ce que fait le code |
|---|---|---|---|
| `batiments_machines_agricoles`, `residentiel_sobriete` | forme « FE électricité * 67,4% » | coefficient sans cellule ni explication ; le facteur de base date de 2017 | repris tel quel (facteur 0,0533 au lieu de 0,0791 kgCO2e/kWh) |
| `batiments_machines_agricoles` | `DonneesReference!D16` | demande de « convertir GJ en kWh » sans donner de nombre | 0,0036 GJ/kWh, conversion physique |
| `elevage_durable` | prose de `ElevageDurable` | `− b ×` pour le N2O et rien sur les déjections ; ne donne pas zéro quand rien ne change | formule des formes dessinées, avec `(1 − b)` sur les déjections et le N2O |
| `elevage_durable` | forme « dioxyde d'azote » | libellé pour la réduction de N2O | lu comme protoxyde d'azote (`DonneesReference!A14`) |
| `elevage_durable` | `ParametreDeterminants!D9` | annonce un encadrement de la baisse du facteur entérique sans le donner | borne de 0 à 1 |
| `elevage_durable` | `DonneesReference!K10` et `K14` | « p. 28 du Secten » ; le code cite la page 34 | valeurs 28 et 265, identiques |
| `produits_bois` | `DonneesReference!E21`, `K21`, `K22` | « OMINEA 2025, tableau 83, p. 131 » | OMINEA 2026, tableau 45, p. 97 |
| `residentiel_sobriete` | `Residentiel_Sobriete!A20`, `ParametreDeterminants!E49` | le paramètre de baisse de consommation est rattaché au levier « Tertiaire - Sobriété des bâtiments » | utilisé pour ce levier |
| `residentiel_sobriete` | `Residentiel_Sobriete!D33` | facteur du réseau de chaleur en « g éq. CO2/kWh » alors que les valeurs du SDES (0 à 0,50) sont des kg/kWh | lu en kg/kWh ; lu en g, il serait 1 000 fois plus petit |
| `residentiel_sobriete` | `Residentiel_Sobriete!A25` | parc de logements listé comme donnée de territoire, absent de la formule | non utilisé |
| `transport_personnes_efficacite` | `TrsptPers_Efficacité!B13` | le texte dit que la baisse totale est une somme, le dessin la calcule comme un produit | produit : 15,9 % de baisse contre 16,6 % dans un cas de test |
| `transport_personnes_efficacite` | `ParametreDeterminants!B30:B33` | même abréviation pour deux paramètres (« % Application de l'éco conduite voyageurs », « % Augmentation nombre de voyageurs par véhicule ») | un paramètre par mode |
| `transport_personnes_efficacite` | `DonneesReference!D29` | deux potentiels d'écoconduite pour une seule ligne, dont la valeur est dans la colonne des commentaires | 15 % pour les voitures et les bus |
| `transport_personnes_efficacite` | `TrsptPers_Efficacité!A37` | « Taux de remplissage moyen des VP autres trajets » listé, inutilisé par la formule | non utilisé |
| `transport_personnes_sobriete_deplacements`, `transport_personnes_report_modal`, `transport_personnes_efficacite`, `transport_personnes_electrification` | `TrsptPers_SobriétéDéplacements!B15` | le dessin multiplie les facteurs par le taux de remplissage, la cellule dit de diviser (pour les voitures seulement) | division par 1,165, étendue au bus |
| `transport_personnes_report_modal` | `ParametreDeterminants!H34` et `H35` | « inférieur à 100 % » sans dire strict ou large | 100 % accepté |
| `transport_personnes_report_modal` | forme de la troisième ligne | `PK × 52,14 × r_actifs × (FE_TC − 0)` dessinée hors de l'accolade | ignorée (+22 % si gardée, région 84) |
| `transport_marchandises_efficacite` | `TrsptMarch_Efficacité!B13` | le texte dit « somme », le dessin donne un produit | produit : 15,9 % contre 16,6 % dans un cas de test |
| `transport_marchandises_report_modal` | formes de `TrsptMarch_ReportModal` | le dessin croise les facteurs ferroviaire et fluvial ; les coefficients 0,8064, 1,0164, 0,8176 et 0,9576 ne figurent dans aucun document REMOVE lu | ferroviaire avec `FE_TFM`, fluvial avec `FE_TFlM`, comme le Scénario global |
| `transport_marchandises_electrification` | forme de `TrsptMarch_Electrification`, `DonneesReference!D38`, `C40`, `D27` | le dessin multiplie le facteur thermique par le taux de chargement ; `D38` l'exprime par véhicule.km alors que `C40` et `D27` le libellent en « kgeqCO2/t.km » | division par le taux de chargement : la multiplication donnerait 5,2 kgCO2e/t.km au lieu de 0,080 |
