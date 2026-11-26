# Points à arbitrer

Le tableur fait foi : toute interprétation nouvelle se signale. Ce document dit, levier par levier, où le calcul est possible, ce qui débloquerait les niveaux non calculés et ce qui affinerait les calculs existants. Il constate ; il ne décide rien. Les réponses du CGDD (Brice et Laurent) au document de questions du 29 octobre 2026 et la documentation fonctionnelle PlanET (juin 2026) tranchent une partie des points : leurs lignes sont retirées ou mises à jour. « Limite reconnue » signale une limite que la documentation déclare, dans sa section 7.8 ou dans les limites du levier concerné, à maintenir ou à faire évoluer. Relecture levier par levier de la documentation fonctionnelle et du tableur le 2026-11-25 : les équations de la documentation sont des images, les formules n'ont donc été comparées qu'à son texte et aux commentaires du tableur.

✅ calculé, aucune question ouverte. ❓ calculé grâce à une hypothèse nommée (`docs/methodology/assumptions.md`) ou à un choix décrit en partie 2. ❌ non calculé, raison en partie 1 (bloqué par une donnée, à décider ou à implémenter, ou hors périmètre).

## Vue d'ensemble

| Secteur | Levier | Région | Département | EPCI |
|---|---|---|---|---|
| Agriculture et bois | Bâtiments et machines agricoles (`batiments_machines_agricoles`) | ✅ | ✅ | ✅ |
|   | Fertilisation azotée (`fertilisation_azotee`) | ❓ | ❓ | ❓ |
|   | Élevage durable (`elevage_durable`) | ❓ | ❓ | ❌ |
|   | Haies (`haies`) | ✅ | ✅ | ✅ |
|   | Produits bois (`produits_bois`) | ✅ | ✅ | ✅ |
|   | Pratiques stockantes (`pratiques_stockantes`) | ❓ | ❓ | ❓ |
|   | Changement d'occupation des sols (`occupation_des_sols`) | ❓ | ❓ | ❓ |
| Énergie et résidentiel | Réseaux de chaleur (`reseaux_chaleur`) | ✅ | ✅ | ✅ |
|   | Résidentiel, sobriété (`residentiel_sobriete`) | ✅ | ✅ | ❓ |
|   | Résidentiel, rénovation (`residentiel_renovation`) | ❓ | ❓ | ❓ |
|   | Résidentiel, changement du système de chauffage (`residentiel_changement_systeme_chauffage`) | ❓ | ❓ | ❓ |
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

Calculés : 21 leviers sur 21 en région, 17 en département, 16 en EPCI.

Quand un point est tranché, sa ligne est retirée ou mise à jour, et le `methodology.md` du levier est corrigé dans la même PR. Une nouvelle PR de levier ajoute ses lignes en partie 2, et en partie 1 pour chaque niveau qu'elle ne calcule pas. Les formules corrigées par rapport au tableur sont dans `formula-corrections.md`.

---

## 1. Niveaux non calculés : où ils en sont

Chaque niveau non calculé figure dans une seule rubrique, selon ce qui le retient : une donnée qu'on n'a pas, un choix à valider alors que la donnée existe, ou le périmètre du tableur. Mise à jour le 2026-11-23 sur la documentation fonctionnelle, le tableur et les réponses du CGDD.

### 1.1 Bloqués par une donnée que nous n'avons pas (1 levier, 1 niveau)

| Levier | Niveaux | Ce qui manque | Où en est la piste |
|---|---|---|---|
| `elevage_durable` | EPCI | un fichier d'effectifs par EPCI cohérent : dans celui d'Agreste (`RA2020_2141_EPCI`, indicateur 040.01), la somme des vaches laitières vaut 5 827 825, soit 1,7 fois les 3 482 723 de la France métropolitaine ; dans 43 départements sur 72 dont le total est publié, la somme des EPCI vaut à peu près deux fois le total départemental (Ain : 81 476 pour 40 738, avec une ligne égale au total du département) | le jeu « RGA2020 EPCI » de data.gouv.fr ne couvre que le Pays Basque : impasse ; le fichier communal Agreste `RA2020_2141_Cheptels_communes` (29 360 communes) a été vérifié : il ne donne que « Herbivores » (26,3 millions de têtes) et « Non herbivores » (299,7 millions), pas de type d'animal, donc pas de vaches laitières ; les lignes `DEPZ` du fichier EPCI portent le total départemental, tantôt sous `DEPZ`, tantôt sous un code EPCI (44 départements) ; classeur d'incohérences préparé pour Agreste ; la documentation (p. 19) et le tableur donnent l'EPCI « OUI » |

### 1.2 À décider ou à implémenter : la donnée existe (0 levier)

Aucun niveau n'est dans ce cas aujourd'hui.

### 1.3 Hors périmètre selon le tableur (4 leviers, 8 niveaux)

| Levier | Niveaux | Ce que dit le tableur | Remarque |
|---|---|---|---|
| `transport_marchandises_sobriete_logistique` | département, EPCI | « Maille EPCI : NON, Maille Département : NON, Maille Région : OUI » | les tonnes.kilomètres du SDES sont régionales ; pas à débloquer |
| `transport_marchandises_report_modal` | département, EPCI | idem | idem |
| `transport_marchandises_efficacite` | département, EPCI | idem | idem |
| `transport_marchandises_electrification` | département, EPCI | idem | idem |

---

## 2. Ce qui affinerait les calculs existants

Pour chaque levier : le point, ce que nous faisons aujourd'hui, ce qui l'affinerait, et l'écart mesuré quand il existe. Les leviers sans ligne n'ont pas de point chiffré.

### Bâtiments et machines agricoles (`batiments_machines_agricoles`, région, département, EPCI)

| Point | Aujourd'hui | Ce qui l'affinerait | Écart |
|---|---|---|---|
| Pêche comprise dans les produits pétroliers | comprise, comme le tableur | la part agricole seule | 9,0 % des produits pétroliers de métropole, 22 % en Bretagne |
| Facteur de l'électricité : millésime | mix moyen 2024 × 67,4 % | la valeur de l'année du calcul | 0,0519 (2024) à 0,058 (2023) avant le coefficient de 67,4 % |
| Facteur du gazole non routier pour tous les produits pétroliers | gazole des engins agricoles (74,52), comme la documentation (p. 51) ; le tableur donne le fioul lourd (78) | une pondération par produit (gazole, essence) | OMINEA : l'essence vaut 72,48, soit 2,7 % de moins |
| Produits pétroliers répartis par la part de SAU | part de SAU | la part de gazole non routier | écart de 3,0 points en médiane, 11,6 au 90e centile ; limite reconnue par la documentation fonctionnelle PlanET (p. 77, à maintenir) |
| Secret statistique | lignes secrètes à 0 | les valeurs sous secret | électricité : 38 % des lignes IRIS ; gaz : 66 % |
| Maille des produits pétroliers | région répartie par la SAU | la donnée départementale que désigne le tableur (`H25`) | non chiffré |
| Millésime | 2024 | le millésime 2023 du tableur pour les produits pétroliers et la chaleur régionaux | non chiffré |
| Territoire sans réseau de chaleur | contribution nulle | un facteur de chaleur de repli | la chaleur agricole ne concerne que 15 communes |
| Gaz en PCS ou PCI | PCI | la précision du jeu | écart de 10 % sur 3,0 % de l'énergie du secteur |
| Réduction d'électricité sans borne basse | au plus 1, négative admise, comme la documentation (7.1.3.2, p. 49) pour le remplacement d'équipements carbonés par des équipements électriques | une borne basse | choix de conception, non validé : −100 % double la consommation d'électricité ; le tableur n'a aucune borne (`ParametreDeterminants!H12:I15` vides) |
| Corse et maille départementale | la Corse est calculée avec les facteurs continentaux ; le département est traité comme un niveau complet ; EPCI corses du gaz non contrôlés | la documentation (3.4, pp. 17-18) ne couvre pas la Corse en V1 et classe le département « limité » (p. 19) | électricité corse : 1,9 % du résultat à 100 % (816 t sur 44 036 t) ; la Corse est aussi calculée en fertilisation et en élevage |
| Échelle de la chaleur et de l'électricité | électricité et gaz locaux, produits pétroliers et chaleur régionaux répartis par la SAU | une lecture unique : la documentation écrit IRIS (7.1.3.3, p. 50), régional réparti par la SAU (équation 5, 7.8.2) et régional réparti par les consommations communales (p. 37) | le code suit l'équation 5 et le tableur ; à signaler au CGDD |

### Fertilisation azotée (`fertilisation_azotee`, région, département, EPCI)

| Point | Aujourd'hui | Ce qui l'affinerait | Écart |
|---|---|---|---|
| Campagne 2022-2023 déduite | azote 2023-2024 ÷ (1 + évolution publiée, arrondie à 0,1 %), pour les régions et les départements | le tableau 2022-2023 révisé, non publié | la valeur déduite diffère de la publiée de 2022-2023 (Île-de-France 63 044 t contre 57 386 t) ; une moyenne de deux campagnes seulement ; Nouvelle-Aquitaine 211 529 t puis 220 836 t, Provence-Alpes-Côte d'Azur 23 761 t puis 21 219 t |
| Livré pris pour épandu | livraisons au département du distributeur | des épandages | Paris reçoit 21 824 t d'azote pour 1 ha de SAU |
| Facteur d'émission national | 5,733 kgCO2e/kg pour tous | un facteur par territoire | incertitude de 400 % |
| Corse départementale | 2A et 2B sans résultat | une publication distinguant 2A et 2B | la Corse est publiée sous le code 20 |
| Ventilation à l'EPCI | azote du département × (SAU − SAU bio de l'EPCI) ÷ (SAU − SAU bio du département), validée par le CGDD (Brice), département par département pour un EPCI à cheval (documentation, p. 45) | l'azote épandu par EPCI | proxy ; SAU du recensement 2020 contre bio 2024 |
| Département plus bio que cultivé | Paris et Hauts-de-Seine (bio 2024 de 190 et 275 ha contre 1 et 5 ha de SAU 2020) : l'EPCI n'en reçoit aucune part | une SAU à jour | les 21 824 t livrées à Paris et les 10 658 t des Hauts-de-Seine ne vont à aucun EPCI ; choix de conception, non validé |
| Part d'un EPCI plafonnée à 1 | plafond à tout l'azote du département | la bio des EPCI sous secret statistique | la bio du département est celle de l'Agence Bio, plus grande que la somme des EPCI non masqués |
| EPCI sous secret statistique | 50 couples EPCI-département sans surface bio : `missing_data`, y compris pour un EPCI à cheval dont un seul département est masqué (Métropole du Grand Paris, département 91) | le fichier de l'observatoire | EPCI de 1 ou 2 fermes bio |
| Département sans livraison d'azote | un EPCI en Corse (2A, 2B) renvoie `missing_data` | une publication distinguant 2A et 2B | |
| Borne de 25 % | 0 à 1, sans signal | la documentation (7.1.1.2, p. 45) propose 25 % en fourchette haute, au-delà duquel on passe en bio | non chiffré ; le choix 9 de la méthodologie disait la borne absente |
| Clé de répartition de l'azote par culture | surface seule | la clé « superficies et besoins en azote de chaque culture » du tableur (`ChgtPratiques!L8`) | la documentation (7.1.1.6, p. 46) l'écarte |

### Élevage durable (`elevage_durable`, région, département)

| Point | Aujourd'hui | Ce qui l'affinerait | Écart |
|---|---|---|---|
| Constantes OMINEA 2013 | 2013, comme le tableur | OMINEA 2026 | vache laitière : 121 contre 121,9 à 152,5 kg de CH4 ; excrétion azotée 115,6 contre 118,7 kg ; limite reconnue par la documentation fonctionnelle PlanET (p. 77, à maintenir) |
| Méthanisation initiale à 0 | 0, comme le tableur | la part initiale | OMINEA 2026 : 9,5 % des truies, 9,8 % des autres porcins ; limite reconnue par la documentation fonctionnelle PlanET (p. 77, évolution possible) |
| Méthanisation des autres animaux | refusée | des facteurs pour caprins, ovins, équins, volailles | aucun facteur disponible |
| Répartition actuelle des déjections nationale | OMINEA 2013 | une répartition par territoire | un territoire à dominante pâture ou lisier part des mêmes proportions ; limite reconnue par la documentation fonctionnelle PlanET (p. 77, évolution possible) |
| Effectifs au siège de l'exploitation | siège | l'effectif réel | un élevage sur deux départements est compté au siège |
| Secret statistique | une catégorie secrète vaut 0 | les valeurs | 0,2 % des volailles des régions, jusqu'à 1,3 % dans 53 départements |
| Vaches laitières de 21 départements sous secret | estimation de cartostat, méthode non décrite | une méthode documentée | 91 et 93 sans valeur |
| Lapines et ruches | non comptées | des facteurs | 422 790 lapines reproductrices en France |
| SV des bovins | milieu de la plage | la valeur retenue par l'inventaire | 3,79 et 1,96 kg par jour |
| Zones pédoclimatiques, millésime | non prises en compte, 2020 | un millésime plus récent et des facteurs locaux | non chiffré ; limite reconnue par la documentation fonctionnelle PlanET (p. 76, à maintenir) |
| Potentiel de baisse entérique | 0 à 1 pour tous les animaux, sans valeur de référence | 14 % pour les bovins (documentation, 7.1.2.2, p. 47) | une saisie à 50 % vaut 3,6 fois le potentiel documenté : 1,7 t contre 0,47 t par vache laitière |
| Catégories d'animaux | onze types dont trois de volailles, sans « autres animaux d'élevage » | les dix catégories de la documentation (7.1.2.3, p. 48), « volailles » en un bloc | le choix 11 de la méthodologie disait suivre la documentation |

### Haies (`haies`, région, département, EPCI)

| Point | Aujourd'hui | Ce qui l'affinerait | Écart |
|---|---|---|---|
| Rabais régionaux de la méthode | non appliqués, comme le tableur | rabais de 5 à 50 % et 10 % de non-permanence | stockage surestimé hors Grand-Ouest ; la documentation retient la valeur basse de la fourchette du Label Bas Carbone, 1,17 à 7,14 tCO2e/km/an (pp. 76, 78 : facteur moyen national à maintenir, fourchette en évolution possible) ; le webinaire du 25/01/2021 (`haies/methodology.md`) donne la même valeur basse |

### Changement d'occupation des sols (`occupation_des_sols`, région, département, EPCI)

| Point | Aujourd'hui | Ce qui l'affinerait | Écart |
|---|---|---|---|
| Facteurs de la région et du département | moyenne des facteurs des communes ALDO Flux 2, pondérée par la surface du type de sol de départ ; moyenne simple si cette surface est nulle | la « zone pédoclimatique majoritaire du territoire » (documentation, p. 74), qu'ALDO ne publie pas : ses facteurs varient à l'intérieur d'une zone ; 48 jeux de valeurs distincts sur 35 066 communes | interprétation nouvelle ; à l'EPCI, les facteurs sont ceux d'ALDO, qu'on n'a pas su reconstruire depuis ceux des communes (ni moyenne simple, ni pondérée par la population ou la surface) : l'écart entre niveaux n'est pas chiffré |
| Surfaces de la région et du département | somme de toutes les communes ALDO, dont 4 sans EPCI ; 19 427 625 ha de cultures contre 19 427 351 ha pour la somme des EPCI | | 275 ha de cultures de plus que les EPCI |
| Désimperméabilisation sans horizon | facteur en tCO2e/ha, non multiplié par l'horizon, comme le dessin de l'équation 27 (image, non vérifiée) et la réponse du CGDD (Q2) | la documentation (7.7.4, p. 75) écrit que les flux annuels sont « multipliés par la période du plan » : confirmer par écrit l'unité du jeu ALDO Flux 2 | EPCI 200046977, 10, 5 et 2 ha/an sur 20 ans : le terme passerait de 280 à 5 595 tCO2e, soit +18 % du total (29 489) |
| Prairie | les trois types ALDO (arborée, herbacée, arbustive) au prorata de leur surface, la documentation n'en nommant qu'un | le type visé par l'afforestation et les zones humides | choix de conception, non validé ; tableur, B15 : « au prorata des surfaces existantes » |
| Sol artificialisé enherbé | « sols artificiels arbustifs » d'ALDO | une colonne ALDO « enherbés » | choix de conception, non validé |
| Surface sans objet | un terme dont la surface de référence est nulle vaut 0 | un refus explicite | choix de conception, non validé |
| Rythme et horizon sans borne | acceptés tels quels, même au-delà des surfaces disponibles ; le tableur dit « selon surface disponible des types de sols concernés » | des bornes par surface disponible | non chiffré |
| Facteur négatif | le résultat peut être négatif | seuls les mouvements positifs comptent selon la documentation (p. 73), qui parle des stratégies, pas du signe des facteurs | `wooded_grassland_to_wetland` est négatif dans 919 des 1 241 EPCI ; les 17 autres colonnes ne le sont jamais |
| EPCI du millésime ALDO | 18 EPCI de métropole du référentiel renvoient `missing_data` | les EPCI à jour dans ALDO | comme `produits_bois` |
| Biomasse forestière absente | prairie vers forêt : sol et litière seulement, le jeu ALDO versionné n'a pas de colonne biomasse | la biomasse aérienne et racinaire des forêts, que la documentation (p. 75) et `FC_COS!A24` comptent | l'afforestation pèse 13 à 27 % des exemples : sous-estimée d'un facteur inconnu ; existence d'une colonne dans le jeu Flux 2 complet non vérifiée |
| Horizon de 20 ans | aucune alerte au-delà | un avertissement : la documentation (p. 75) dit le facteur non représentatif au-delà de 20 ans | résultat linéaire en horizon : 40 ans le double |
| Rythme de préservation des prairies permanentes | absent | le 4e paramètre du tableur (`ParametreDeterminants!A19`), que la documentation (7.7.4.1) ne cite pas | hors du levier, relève du scénario global |
| Ordre de grandeur des facteurs | `cropland_to_wetland` : de 257 à 326 tCO2e/ha/an selon l'EPCI (médiane 275), contre 12 à 75 pour l'afforestation, lu comme un flux annuel ; désimperméabilisation : de 77 à 209 tCO2e/ha | la même donnée lue comme variation sur 20 ans diviserait ce terme par 20 | ce terme fait 85,6 % du résultat de l'exemple 200046977 (25 240 sur 29 489) : lu sur 20 ans, il passerait à environ 1 740 tCO2e ; le CGDD a tranché (Q2), la documentation (p. 75) parle d'un stockage sur 20 ans linéarisé : à confirmer par écrit avec ALDO |

### Pratiques stockantes (`pratiques_stockantes`, région, département, EPCI)

| Point | Aujourd'hui | Ce qui l'affinerait | Écart |
|---|---|---|---|
| Surfaces d'application | saisies par la collectivité, sans borne | des bornes par pratique selon la surface de prairies, vergers, vignes ou cultures (ALDO), que la documentation (7.7.3.3, p. 72) liste comme données du territoire | non chiffré ; limite à maintenir selon la documentation (p. 78) |
| Facteurs de stockage | cinq valeurs moyennes potentielles (Bamière et al. 2023, documentation p. 73), prises en valeur absolue | des valeurs par type de sol et de climat | non chiffré ; la documentation rappelle que ces moyennes ne sont pas toujours atteintes (p. 73) |
| Surfaces négatives | refusées | un net négatif, comme celui des haies | non chiffré ; choix de conception, non validé |
| Pratiques écartées | labour occasionnel, bandes enherbées, intensification des prairies permanentes peu productives | leur prise en compte | écartées par la documentation (p. 72) |
| Facteurs de stockage : documentation contre tableur | les cinq valeurs de la documentation (p. 73) : 753, 1 534, 1 087, 4 078 et 903 kgCO2e/ha/an | les valeurs du tableur (`ChoixPratiquesStockantes!F15:F23`) : 479, 1 078, 587, 3 700 et 620 | pour 1 ha de chaque pratique : 8,355 contre 6,76 tCO2e (+24 %) ; la documentation l'emporte ; `DonneesReference!C19`, citée pour ces valeurs, ne porte que l'unité |

### Produits bois (`produits_bois`, région, département, EPCI)

| Point | Aujourd'hui | Ce qui l'affinerait | Écart |
|---|---|---|---|
| Part de la récolte en m³ prise pour part de la production en tC | proxy | la production de produits bois par département | résultat départemental indicatif ; limite reconnue par la documentation fonctionnelle PlanET (p. 72) |
| Sortie de stock supposée invariante | invariante | l'effet de la hausse de production | non chiffré ; limite reconnue par la documentation fonctionnelle PlanET (pp. 72, 78, à maintenir) |
| Bois d'industrie absent pour 2A, 2B, 75, 93, 94 | compté 0 | les valeurs | 3 milliers de m³ sur 10 311 |
| Millésime | 2022 | 2024 existe pour les tC | non chiffré |
| Ventilation à l'EPCI | récolte du département × part de la forêt de l'EPCI (ALDO, tous peuplements), validée par le CGDD | la récolte par EPCI | proxy ; un EPCI à cheval se calcule département par département (documentation, p. 71) |
| EPCI du millésime ALDO | 18 EPCI de métropole du référentiel renvoient `missing_data` | les EPCI à jour dans ALDO | 27 EPCI d'ALDO hors référentiel, environ 1,5 % de la forêt, non attribués |
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
| Taux par réseau | un taux unique pour tous les réseaux | un taux par réseau : la documentation (7.5.1.2) permet de viser certains réseaux | capacité absente, pas d'erreur de chiffre |
| Livraisons tous secteurs | `CONSOTOT` : livraisons de tous les secteurs, 27 réseaux de froid compris (418 578 MWh, 1,5 %) | les livraisons des secteurs couverts : la documentation (7.5.1.3) parle de production et dit que PlanET ne couvre ni le tertiaire ni l'industrie (7.6.1.1) | risque de double compte avec les leviers résidentiels, à confirmer avec le CGDD ; non chiffré |

### Résidentiel, sobriété (`residentiel_sobriete`, région, département, EPCI)

| Point | Aujourd'hui | Ce qui l'affinerait | Écart |
|---|---|---|---|
| CEREN indisponible | bilan SDES 2024 | le CEREN | concorde à 5 % près au national ; le SDES est constaté, le CEREN à climat normal |
| Facteur de l'électricité : millésime | mix moyen 2024 × 67,4 % | la valeur de l'année du calcul | 0,0519 (2024) à 0,058 (2023) avant le coefficient de 67,4 % |
| Répartition fioul 80 % / GPL 20 % | part nationale du CEREN 2024 | un CEREN par région ou une autre clé | change les deux vecteurs |
| Fioul et GPL départementaux | ventes 2024 de FOD et GPL | les consommations | ventes tous clients, unité non publiée : la Haute-Corse vend 27 fois la Corse-du-Sud |
| Bois non compté | non compté | sa consommation | effet nul sur ce levier : le facteur du bois vaut 0 (documentation, 7.2.1.2) |
| Baisse de consommation par défaut | obligatoire, sans défaut | la documentation (7.2.4.2) donne 12 % (Déclics 2008-2018) ; le tableur donne 10 % (`F20`, `ParametreDeterminants!I49`) | un défaut de 12 % contre 10 % change le résultat de 20 % |
| Facteurs du gaz et du fioul | OMINEA, comme le tableur (`Residentiel_Sobriete!A29:G31`) | la Base Empreinte, que cite la documentation (7.2.1.2) | valeurs Base Empreinte non vérifiées ; demander la source retenue à l'ADEME |
| Secret statistique | lignes secrètes à 0 | les valeurs | électricité 2,6 %, gaz 5,3 % des lignes, 14 % des réseaux |
| Formule appliquée à la consommation initiale | consommation initiale | la consommation restante après les deux autres leviers résidentiels | non chiffré |
| Départements et régions | sources différentes | une source commune | la somme des 96 départements dépasse celle des 13 régions de 0,9 % |
| EPCI : clé de répartition du fioul et du GPL | m² de logements chauffés au fioul (`CMBL` = 3) ou au GPL (`CMBL` = 5), RP2022 : la part de l'EPCI dans ceux du département, pour chaque département où il a des communes | une consommation par EPCI, ou une consommation par m² propre à l'EPCI | suppose la même consommation par m² dans tout le département ; interprétation nouvelle, la documentation (p. 51) désigne le Fichier Logements sans fixer la règle de répartition |
| EPCI : `CMBL` = 5 lu comme GPL | « gaz en bouteilles ou en citerne » | une modalité propre au GPL | le propane en citerne et le butane en bouteille sont tous deux du GPL ; non chiffré |
| EPCI : électricité et gaz | SDES 2024, somme des opérateurs de l'EPCI ; ligne secrète à 0 ; EPCI sans ligne de gaz à 0 | les valeurs sous secret | non chiffré ; la somme des 1 232 EPCI calculés dépasse de 0,015 % celle des 96 départements |
| EPCI : outre-mer | 23 EPCI sans parc de logements : `missing_data` | le fichier Logements des DOM | le parc INSEE construit ne couvre que la métropole |
| EPCI : surface chauffée du parc | m² estimés à partir des classes de superficie (milieux de classe), ponctuation de poids du recensement | surfaces déclarées | le bois est dans « autre » et n'a pas de colonne propre |

### Résidentiel, changement du système de chauffage (`residentiel_changement_systeme_chauffage`, région, département, EPCI)

| Point | Aujourd'hui | Ce qui l'affinerait | Écart |
|---|---|---|---|
| Énergie de chauffage par territoire | part nationale du chauffage et de l'ECS par vecteur (SDES 2024 ; la documentation, p. 51, range les deux usages sous ces leviers) × consommation résidentielle du territoire : électricité 46,7 %, gaz 92,6 %, fioul 100 %, chaleur 100 % | le CEREN, énergie livrée au chauffage et à l'ECS par département | interprétation nouvelle ; suppose le même usage partout ; Ille-et-Vilaine : 2,93 TWh de chauffage et d'ECS (électricité, gaz, fioul) sur 4,41 TWh tous usages ; corrigé le 2026-11-23 : la première version ne prenait que le chauffage ; le SDES republie les données du Ceren sans traitement additionnel (« Source : Ceren, calculs SDES »), à climat réel : le classeur du site du Ceren (mise à jour du 20 décembre 2024, climat normal, TWh entiers) donne des parts plus basses de 3 à 6 points (électricité 41,2 %, gaz 87,9 %, GPL 50 %) et 73 TWh de bois ; ses consommations par type et période (maisons après 2013 : environ 770 kWh/m²) sont incohérentes avec Phébus 2013 et inutilisables |
| Rendements : ancien et rénové | ancien (gaz 75 %, fioul 75 %, bois 70 %, électricité 95 %) pour l'énergie actuelle, rénové (90 %, 90 %, 75 %, 100 %) pour la cible ; chaleur à 1 | un seul coefficient par vecteur, comme le tableur (B15) | le tableur n'a qu'un rendement par vecteur et renvoie à la p. 156 qui en donne deux ; interprétation nouvelle ; le gain de rendement est dans le résultat |
| Bois | consommation de base 0, part cible acceptée, facteur 0, rendement rénové 75 % (le plus bas de 75 % et 85 %) | la consommation de bois du CEREN | limite reconnue par la documentation (pp. 52-53) ; un passage au bois supprime les émissions du vecteur quitté |
| GPL | non modifié, ni source ni cible | le rendement du GPL | pas de valeur dans la p. 156 du rapport ADEME ; le tableur traite le GPL comme un vecteur (rendement `Residentiel_ChgtSyst!A38`, facteur `A33`, `SG_Résidentiel!E12` : le levier diminue gaz, GPL et fioul) mais sans paramètre cible GPL ; le GPL pèse 53,2 % de sa consommation en chauffage et ECS |
| Pompes à chaleur | confondues avec l'électricité, un rendement de 100 % pour la cible (choix de conception contraire à la documentation) | la distinction des générateurs électriques par la BDNB (effet Joule, PAC air-air, air-eau, eau-eau, géothermie), que prévoient la documentation (7.2.1.1) et `Données_Parc_habitation!A11:A13`, et le COP du CSTB | le tableur dit « un seul coefficient » pour l'électrique (B15) ; le lien CSTB est mort ; le gain d'une PAC change d'un facteur de l'ordre de 3 sur l'électricité, non chiffré sur les données |
| Parts cibles | facultatives : une part non précisée garde sa proportion actuelle de l'énergie utile et partage ce que les parts données laissent ; sans part, le mix actuel | une règle de la documentation pour répartir le reste (p. 55 donne le mix actuel par défaut sans la dire) | interprétation nouvelle ; le mix actuel est estimé avec les parts nationales, le bois à 0 ; une seule part non précisée prend tout le reste ; plusieurs parts non précisées sans usage actuel (bois et réseau absent) ne peuvent pas se partager un reste : requête refusée |
| Facteur du réseau de chaleur | moyenne pondérée des réseaux du territoire ; 0 sans réseau | un facteur par défaut sans réseau | un EPCI sans réseau qui vise du réseau de chaleur évite des émissions sans coût : la somme des 1 232 EPCI (20,77 MtCO2e pour une cible donnée) dépasse de 6,8 % celle des départements |
| Formule | lue dans les commentaires du tableur (`Residentiel_ChgtSyst!B13, B15`), la cellule « Formule » est vide | la cellule | énergie utile = consommation × rendement ; cible = énergie utile × part ÷ rendement ; réduction = Σ (consommation − cible) × FE |
| Facteurs d'émission | ceux de `residentiel_sobriete` (électricité × 67,4 %, gaz et fioul OMINEA 2024) | | |

### Résidentiel, rénovation (`residentiel_renovation`, région, département, EPCI)

| Point | Aujourd'hui | Ce qui l'affinerait | Écart |
|---|---|---|---|
| Consommation avant rénovation | consommation résidentielle du territoire × part nationale du chauffage et de l'ECS par vecteur (SDES 2024, donnée du Ceren), répartie à la surface des logements chauffés à ce combustible : la même au m² pour tous les types et toutes les périodes | le CEREN, consommation par m² par type, combustible, période et département (tableur : « Pas disponible en open source ») | interprétation nouvelle ; moyennes nationales en énergie finale pour le chauffage et l'ECS : électricité 84 kWh/m², gaz 109, fioul 122, GPL 98, chaleur 146, recalculées le 2026-11-26 sur les consommations régionales et les m² du parc INSEE (les valeurs précédentes ne se reproduisent pas avec ces entrées) ; bois 164 avec les 65,9 TWh du SDES sur les m² « autre » ; un gradient par période de construction (Phébus 2013, CGDD n° 645 : de 0,017 tep/m² avant 1970 à 0,012 après 2006) changerait la part éligible de +0,5 % (fioul) à +3,7 % (gaz), +13,8 % pour la chaleur |
| Collectifs d'après 1971 | niveau BBC rénovation de la documentation (p. 54) : consommation par m² plafonnée à 110 kWhEP et 11 kgCO2e, les seuils de la classe B du DPE ; équation 7 lue (page 53) : (consommation par m² avant − après) × m² × facteur d'émission par typologie ; coefficients d'énergie primaire du DPE (électricité 1,9 depuis le 1er janvier 2026, autres énergies 1) et facteurs d'émission de la documentation (interprétation nouvelle, choix de conception, non validé) | la façon dont la documentation déduit la consommation « après » du BBC, les coefficients d'énergie primaire et la consommation par type de logement du CEREN | le total des 96 départements à 50 % du parc passe de 4,52 à 5,98 MtCO2e (+32 %) ; le plafond d'émissions fait presque tout le gain du gaz (−50 %), du fioul (−66 %) et du GPL (−51 %), l'énergie primaire celui de l'électricité (−31 %) ; sensibilités sur le total : facteurs d'émission du DPE pour le plafond (gaz 0,227, fioul 0,324, GPL 0,272, électricité 0,079) +1,8 %, gradient par période de Phébus 2013 −3,4 %, électricité à 2,3 (avant 2026) +0,5 % ; la même consommation par m² pour les logements récents et anciens |
| Maisons et appartements d'avant 1971 | −35 % de la consommation, exigence de l'ANAH (tableur, A34 ; documentation, p. 54) | | |
| Paramètre | une seule part de parc rénové, appliquée de la même façon à tous les types | une part par typologie de logement, prévue par la documentation (p. 54) | non chiffré |
| Logements déjà rénovés | non déduits du parc : les consommations moyennes embarquent des logements déjà rénovés | une part de parc « disponible » à rénover | limite reconnue par le tableur (`B15`) ; sous-estime les gains |
| Régions, départements et EPCI | totaux à 50 % du parc : 4,48, 4,52 et 4,53 MtCO2e, environ 1 % d'écart | une source commune de consommation | consommations de jeux différents, comme `residentiel_sobriete` |
| Climatisation | non comptée | le tableur la compte dans le périmètre du DPE (`B13`) | 2,6 TWh d'électricité en 2024, négligeable |
| Constructions postérieures au recensement | non comptées | | limite reconnue par la documentation (p. 54) |
| Bois | consommation de base 0 : le parc INSEE n'a pas de bois | la consommation de bois du CEREN | limite reconnue par la documentation (pp. 52-53) ; facteur d'émission nul |
| Facteurs d'émission | ceux de `residentiel_sobriete` (électricité × 67,4 %, gaz, fioul, GPL OMINEA 2024) ; chaleur : réseaux du territoire, 0 sans réseau | | |

### Transport de personnes (`transport_personnes_sobriete_deplacements`, `transport_personnes_report_modal`, `transport_personnes_efficacite`, `transport_personnes_electrification`)

| Point | Leviers concernés | Aujourd'hui | Ce qui l'affinerait | Écart |
|---|---|---|---|---|
| Taux de remplissage de 1,4 | les quatre | valeur « courte distance » de la Base Carbone (v23.11, p. 173, ENTD 2008), valeur par défaut du domicile-travail selon la documentation (pp. 58 et 60) ; remplace le 1,165 du tableur (SDES, motif « Professionnel ») | « mixte France » (1,6) ou une valeur domicile-travail | valeur « courte distance » validée par l'équipe le 2026-11-19 ; le taux plus récent du SDES (2018-2019) est plus bas ; la valeur 1,4 n'apparaît pas dans le texte extrait des pp. 58 et 60 (équations en images) : à revérifier ; la documentation (7.3.1.2) le dit modulable par la collectivité, seule l'efficacité a un paramètre |
| Potentiel d'écoconduite | efficacité | 10 % unique, valeur par défaut de la documentation (p. 61), confirmée le 2026-11-19 ; le tableur donne 15 % ; la documentation écrit aussi 15 % pour le fret (7.3.9.4, p. 66) et dit en 7.8.4 que le pourcentage « n'est pas sourcé » | une valeur par mode | le résultat lui est proportionnel : 10 contre 15 % change le gain de 33 % |
| Part du ferré par défaut | les quatre | 82 % en Île-de-France, 24 % ailleurs | une part par territoire | l'EPCI 247800550 est à 89 % francilien et prend 24 % |
| Facteur du ferré | report modal, sobriété | amont × 67,4 % (documentation fonctionnelle, 7.3.8.4, p. 65, étendue par analogie), combustion nulle ; 0,187 en Corse | la combustion des TER diesel (la documentation écrit « amont × 67,4 % et combustion » en 7.3.8.4 et dit en 7.3.1.3, p. 58, que le facteur embarque de l'amont thermique) et le périmètre du facteur corse | écart avec la documentation ; le rail pèse 0,35 % du total en région 84 et 8,3 % en Île-de-France (un facteur ferré supérieur de 60 % donnerait environ +5 % en Île-de-France) |
| Facteur des voitures | les quatre | parc, calcul d'essai non reproduit | le facteur du trajet, un calcul reproduit | non chiffré |
| Pondération Crit'Air | efficacité, électrification | un facteur national par carburant | une pondération par territoire | non chiffré |
| Bus en CO2 seul | efficacité, électrification | OMINEA 2024, CO2 seul, valeur basse | CH4 et N2O, Base Empreinte | 0,0874 contre 0,0805 kgCO2e/passager.km |
| Parc de bus et cars immatriculé au siège | efficacité, électrification, sobriété | siège | le parc circulant | trois communes portent 17,7 % du parc ; 276 des 1 243 EPCI sans bus classé |
| Trajets de moins de 100 km, domicile-travail | les quatre | périmètre de la base | autres motifs et longues distances | 772 644 actifs métropolitains hors champ ; DOM absents |
| Deux-roues motorisés | efficacité, électrification, sobriété | sans terme ; hors périmètre selon la documentation fonctionnelle (p. 58 : « par manque de données » sur la motorisation du parc), le tableur donne un facteur (`DonneesReference!D25`) sans terme dans les formules | un terme | 1,4 % des passagers.km ; limite à maintenir |
| Base du report des transports en commun vers les modes actifs | report modal | passagers.km en transport en commun initiaux, sans enchaîner avec le report de la voiture vers les transports en commun | l'enchaînement du tableur ; la documentation (7.3.3.2) annonce deux paramètres, en liste trois et dit que « ces deux pourcentages sont une part des km.passager en voitures » : confirmer la base par écrit | région 84, 20 % : 20 712 t sur la base des transports en commun, environ 178 130 t sur la base des voitures (rapport 8,6 en région 84, 1,09 en Île-de-France) |
| Électrification : plafond de `x` | électrification | part du parc entier, comme le tableur (`TrsptPers_Electrification!G19:G20` : points de pourcentage supplémentaires) et la documentation (7.3.5.2), plafonnée à la part thermique | la part des véhicules thermiques | seul le plafond est un choix de conception, non validé ; le parc entier couvre aussi les trajets de plus de 100 km |
| Facteur électrique | électrification | amont seul, identique partout, sans le coefficient de 67,4 % que le ferré applique | le coefficient de 67,4 % de l'encadré transverse de la documentation (« mobilisé dans les différentes équations ») et le mix local | vérifier que l'élément 28007 ne l'inclut pas déjà ; avec 0,674, le gain d'électrification monte de 2,8 % (voiture) à 4,5 % (bus) |
| Facteur du bus ÷ 10 | sobriété | par analogie avec la voiture | la cellule pour les bus | non chiffré |
| 273 EPCI avec transport en commun sans bus classé | sobriété | facteur national de bus | leur parc réel | un réseau surtout ferré est chiffré au facteur du bus |

### Transport de marchandises (`transport_marchandises_sobriete_logistique`, `transport_marchandises_report_modal`, `transport_marchandises_efficacite`, `transport_marchandises_electrification`)

| Point | Leviers concernés | Aujourd'hui | Ce qui l'affinerait | Écart |
|---|---|---|---|---|
| Taux de chargement des poids lourds | les quatre | 8,1 t (2019) | la valeur SNBC 3 | 8,7 t en 2030 : −7 % sur le facteur par t.km |
| Courte ou longue distance | les quatre | route et ville, type de trajet par défaut du tableur (`FE_transports!A22`, `A31`) | le trajet réel du fret, que le tableur ne nomme pas | la longue distance donne un facteur de 24,5 % plus bas (0,0796 contre 0,1055 kgCO2e/t.km) |
| Flux avec l'étranger | les quatre | trafic interne + 50 % du trafic chargé ou déchargé dans la région + 100 % des importations (`International entrant`), comme la documentation (p. 63) ; le tableur ignore la règle des importations | la notice SDES qui confirme que `International entrant` désigne les importations ; le traitement du transit et des exportations, que la documentation ne dit pas (50 % aujourd'hui) | 277,64 contre 171,71 milliards de t.km avec ou sans l'étranger (l'ancienne règle, importations à 50 %, donnait 239,97) ; les quatre leviers sont proportionnels aux t.km |
| Poids lourds non diesel au facteur diesel | les quatre | diesel | un facteur par carburant | 10 462 au gaz (1,70 %), 500 à l'essence (0,08 %), 209 « inconnu » |
| Biodiesel, vignettes sans correspondance | les quatre | écartés de la moyenne | leur facteur | 2 485 poids lourds biodiesel ; 3 à 14 % du parc diesel d'une région |
| CO2 seul | les quatre | CO2 | CH4 et N2O | environ +1,7 % |
| Parc immatriculé, pas circulant | les quatre | parc de la région | le parc circulant | non chiffré |
| T.km non rattachées | les quatre | hors des 13 régions | leur rattachement | 6,7 milliards de t.km et celles des DOM |
| Hydrogène avec l'électrique | les quatre | facteur électrique | un facteur propre | 907 poids lourds en métropole |
| Facteurs ferroviaire et fluvial | report modal | périmètres différents ; ferroviaire : combustion + amont × 67,4 % (0,006442462), comme la documentation (7.3.8.4, p. 65) ; fluvial : combustion seule | des périmètres identiques | non chiffré ; le passage de l'amont entier (0,007278) à 67,4 % a ajouté 0,8 % au résultat de la région 84 |
| Barges et pousseurs | report modal | facteurs des automoteurs | des facteurs par type | `FE_fluvial!B23` donne 348 pousseurs ou barges, 24 % de la flotte pondérée de 1 436 ; le « 344 barges (32 % des 1 088 bateaux) » de la méthodologie n'est pas retrouvé : à vérifier |
| Cyclologistique | report modal | retirée de la base des reports, sans crédit d'émissions évitées : plus on en saisit, moins on évite | la documentation (7.3.8.1 et 7.3.8.2) la présente comme un report des poids lourds : un crédit `FE_TRM × t.km` et une borne par les t.km | Corse, 1 Gt.km : −8 231 tCO2e ; la forme dessinée du tableur n'a pas été lue ; sens à confirmer |
| Potentiel d'écoconduite de 10 % | efficacité | 10 % pour tous les poids lourds, comme le transport de personnes (décision de l'équipe du 2026-11-19) ; la documentation (7.3.9.4, p. 66) et le tableur (`DonneesReference!D29`) donnent 15 % pour le fret, le 10 % vient de la p. 61 (transport de personnes) | 15 %, ou des gains par type d'activité | région 84, 50 % d'application et +20 % de chargement : 805 183 contre 885 701 tCO2e (+10 %) ; écoconduite seule à 100 % : +50 % ; le guide EVE donne 5 à 15 % (10 % en moyenne) qui s'estompent ; la documentation dit aussi en 7.8.4 que le pourcentage n'est pas sourcé |
| Chargement sans plafond | efficacité | hausse relative acceptée sans borne | une borne : avec le taux moyen de 60 % de la documentation (7.3.9.2, p. 65), plus de +66,7 % dépasse 100 % de remplissage | la documentation renvoie à 7.3.6.2, qui ne contient pas ce taux ; le code utilise 8,1 t |
| Un seul facteur électrique | électrification | 0,0467, validité avril 2021 | un facteur par catégorie | incertitude de 70 % ; valable de 3,5 à 7,5 t |
| Facteur électrique des poids lourds | électrification | 0,0467, élément 28030 (3,5 à 7,5 t) | lever la contradiction de la documentation : 7.3.10.4 donne un facteur, 7.8.4 dit qu'il n'y en a pas | non chiffré ; à signaler à l'ADEME |
| Part électrifiée plafonnée | électrification | plafonnée à la part thermique | une règle du tableur | 0,15 % du parc est déjà zéro émission |
| T.km réparties uniformément entre les poids lourds | électrification | uniforme | une répartition réelle | non chiffré |

### Déchets (`dechets_mode_de_traitement`, `dechets_sobriete`)

| Point | Leviers concernés | Aujourd'hui | Ce qui l'affinerait | Écart |
|---|---|---|---|---|
| Tonnes des sites ou déchets du territoire | les deux | sites de traitement (IREP 2022), confirmé par Laurent et la documentation (p. 68) | les déchets collectés, que la collectivité pourrait fournir | 911 EPCI sur 1 255 sans site ont un résultat nul ; Paris au département ; approche cadastrale reconnue par la documentation (p. 70) |
| Terres et pierres sans facteur | les deux | terme non calculé, Laurent confirmant qu'il n'existe pas de facteur d'émission | un facteur pour 20 02 02 | 28,2 % du stockage ; région 84 : 51 700,6 t ; Île-de-France : 2 527 010,76 t |
| Incinération sans récupération (D10) | les deux | comptée avec le stockage | une séparation | 1 207 376 t contre 61 517 t dans SINOE 2021 (19,6 fois) ; limite reconnue par la documentation fonctionnelle PlanET (p. 69) |
| Facteurs d'une famille voisine | les deux | 23 codes sur 35 | des facteurs propres | non chiffré |
| Récupération d'énergie non créditée | les deux | zéro, comme le tableur | un crédit | limite assumée par le tableur |
| Un seul millésime | les deux | 2022 | 2023 ou 2024 | publiés |
| Taux par type de déchet | les deux | une fraction pour tous les types | un taux par code de déchet : la documentation (7.6.2.2 et 7.6.3.2) permet de l'ajuster | capacité absente, pas d'erreur de chiffre |
| Déchets dangereux | les deux | fichier IREP « non dangereux » seul : aucun code à `*` | les codes dangereux du chapitre 20, que la documentation (7.6.1.1) couvre et pour lesquels `FE_déchets` donne 16 facteurs | tonnage non chiffré ; ces facteurs ne sont jamais mobilisés |
| Exhaustivité d'IREP et collecte | les deux | non signalées | la limite de la documentation (7.8.5, 7.6.2.4) : sites qui ne déclarent pas ; facteurs de la Base Empreinte qui incluent la collecte (7.6.1.2) | qualitatif ; déjà dit pour les réseaux de chaleur |
| Arrondissements de Paris, Lyon, Marseille | les deux | rapportés à leur commune | l'arrondissement | non chiffré |
| Cumul avec le changement de mode | sobriété | chaque levier seul | l'enchaînement du tableur, que le CGDD demande de reproduire | la somme des deux diffère du cumul |

---

## 3. Points qui affinent tous les leviers

| Point | Aujourd'hui | Ce qui l'affinerait |
|---|---|---|
| Cumul des leviers d'un même secteur (feuilles `SG …`, `Scénario global …`) | chaque levier seul sur les valeurs initiales | l'enchaînement du tableur (« 1 − % »), demandé par le CGDD (Brice, Laurent) : les calculs unitaires restent des ordres de grandeur |
| Statut `status` du résultat pour `haies` et `pratiques_stockantes` (sans territoire) | lu au niveau `region` du registre, les trois niveaux ayant le même statut (test du registre) ; choix de conception, non validé | un statut propre au levier dans le registre |
| Limites du résultat (`limits`) | les lignes du tableau « Limites » de chaque `methodology.md`, identiques à tous les niveaux et sans le chiffrage propre au territoire demandé ; choix de conception, non validé | des limites par niveau, le périmètre et le millésime des données |
| Provenance des données (`datasets`) | les jeux lus par le calcul, avec la source, le millésime et la date de récupération du manifeste ; le référentiel des communes (`territoires/`) en est exclu ; le périmètre géographique est celui que la source du manifeste énonce ; choix de conception, non validé | un périmètre structuré dans le manifeste ; les constantes en code (facteurs d'émission, rendements) ne sont pas des jeux et n'y figurent pas |
| Outre-mer | absent de la plupart des jeux | des jeux couvrant les DOM |
| Zone climatique et logements d'avant 1945 | non pris en compte, limites de la documentation (7.8.3) | la documentation écrit 1945 en 7.8.3 et 1948 en 7.2.1.4 : à signaler à l'ADEME |
| Valeurs sans source dans le classeur | 55,88, 78, 5,733, 0,187, 0,0467, 8,1 | une vérification contre leurs sources externes (Base Empreinte, OMINEA, SDES) |
| Valeurs négatives dans les CSV | aucune borne | un contrôle commun |
| Bornes et défauts des paramètres | 0 à 1 pour les fractions, 0 ou plus pour les hausses, obligatoires sans défaut ; la documentation donne des valeurs de référence (25 % pour la fertilisation, 7.1.1.2 ; 14 % de baisse entérique des bovins, 7.1.2.2) et admet une réduction d'électricité négative en bâtiments agricoles (7.1.3.2), acceptée sans borne basse ; `ParametreDeterminants` n'a aucune borne et ses colonnes H et I sont vides, sauf `I8` et `I9` (0) et `I49` (0,1) ; `ElevageDurable!F19:F21` et `ProduitsBois!F19` affichent 0 par une recherche dans cette feuille, y compris sur des cellules vides | des bornes et des défauts donnés par le tableur |

---

## 4. Erreurs apparentes du tableur

Une ligne par constat sur une cellule ou une forme du classeur. Le code ne dépend pas de la réponse, sauf mention.

| Levier | Cellule | Constat | Ce que fait le code |
|---|---|---|---|
| `batiments_machines_agricoles`, `residentiel_sobriete` | forme « FE électricité * 67,4% » | le coefficient n'a pas de cellule ; la documentation fonctionnelle l'explique (part « combustion à la centrale », valeur 2024) ; le tableur renvoie au jeu « mix moyen » de la Base Empreinte sans en fixer le millésime | mix moyen 2024 × 67,4 % = 0,0519 × 0,674 = 0,0349806 kgCO2e/kWh (élément 43642), en remplacement de l'élément 15591 (« Autres pays du monde », AIE 2013) retenu à tort |
| `batiments_machines_agricoles` | `DonneesReference!D16` | demande de « convertir GJ en kWh » sans donner de nombre | 0,0036 GJ/kWh, conversion physique |
| `elevage_durable` | prose de `ElevageDurable` | `− b ×` pour le N2O et rien sur les déjections ; ne donne pas zéro quand rien ne change | formule des formes dessinées, avec `(1 − b)` sur les déjections et le N2O, confirmée par la documentation fonctionnelle (équation 3, p. 47) |
| `elevage_durable` | forme « dioxyde d'azote » | libellé pour la réduction de N2O | lu comme protoxyde d'azote (`DonneesReference!A14`), confirmé par Laurent |
| `elevage_durable` | `ParametreDeterminants!D9` | annonce un encadrement de la baisse du facteur entérique sans le donner | borne de 0 à 1 ; la documentation (7.1.2.2, p. 47) donne 14 % pour les bovins (3,5 % de lipides dans la ration) |
| `elevage_durable` | `DonneesReference!K10` et `K14` | « p. 28 du Secten » ; le code cite la page 34 | valeurs 28 et 265, identiques |
| `produits_bois` | `DonneesReference!E21`, `K21`, `K22` | « OMINEA 2025, tableau 83, p. 131 » | OMINEA 2026, tableau 45, p. 97 |
| `residentiel_sobriete` | `Residentiel_Sobriete!A20`, `ParametreDeterminants!E49` | le paramètre de baisse de consommation est rattaché au levier « Tertiaire - Sobriété des bâtiments » | utilisé pour ce levier |
| `residentiel_sobriete` | `Residentiel_Sobriete!D33` | facteur du réseau de chaleur en « g éq. CO2/kWh » alors que les valeurs du SDES (0 à 0,50) sont des kg/kWh | lu en kg/kWh ; lu en g, il serait 1 000 fois plus petit |
| `residentiel_sobriete` | `Residentiel_Sobriete!A25` | parc de logements listé comme donnée de territoire, absent de la formule | non utilisé |
| `transport_personnes_efficacite` | `TrsptPers_Efficacité!B13` | le texte dit que la baisse totale est une somme, le dessin la calcule comme un produit | produit : 15,9 % de baisse contre 16,6 % dans un cas de test |
| `transport_personnes_efficacite` | `ParametreDeterminants!B30:B33` | même abréviation pour deux paramètres (« % Application de l'éco conduite voyageurs », « % Augmentation nombre de voyageurs par véhicule ») | un paramètre par mode |
| `transport_personnes_efficacite` | `DonneesReference!D29` | deux potentiels d'écoconduite pour une seule ligne, dont la valeur est dans la colonne des commentaires | 10 % pour les voitures et les bus (documentation, p. 61) |
| `transport_personnes_efficacite` | `TrsptPers_Efficacité!A37` | « Taux de remplissage moyen des VP autres trajets » listé, inutilisé par la formule | non utilisé |
| `transport_personnes_sobriete_deplacements` | `TrsptPers_SobriétéDéplacements!B15` | le dessin multiplie les facteurs par le taux de remplissage, la cellule dit de diviser pour les voitures et ne dit rien du bus | division par 1,4, étendue au bus par analogie |
| `transport_personnes_report_modal` | `TrsptPers_ReportModal!B15` | le dessin multiplie les facteurs par le taux de remplissage, la cellule dit de diviser (voitures) | division par 1,4 |
| `transport_personnes_efficacite` | `TrsptPers_Efficacité!B15`, `TrsptPers_SobriétéDéplacements!B15`, `TrsptPers_ReportModal!B15` | le dessin multiplie les facteurs par le taux de remplissage ; `B15` de l'efficacité ne le dit pas, celles des onglets de sobriété et de report modal disent de diviser (voitures) | division par 1,4 |
| `transport_personnes_electrification` | `TrsptPers_Electrification!B15` | le dessin multiplie les facteurs par le taux de remplissage ; la cellule est vide | division par 1,4, par analogie avec les autres onglets |
| `transport_personnes_report_modal` | `ParametreDeterminants!H34` et `H35` | « inférieur à 100 % » sans dire strict ou large | 100 % accepté |
| `pratiques_stockantes` | `PratiquesStockantes!C19`, `ParametreDeterminants!B23` | le paramètre est un « % application » rapporté à la SAU alors que la documentation (7.7.3.2) parle d'une surface en hectares | surface en hectares, comme la documentation |
| `transport_personnes_report_modal` | forme de la troisième ligne | `PK × 52,14 × r_actifs × (FE_TC − 0)` dessinée hors de l'accolade avec les passagers.km en voiture, dans le tableur comme dans la documentation (p. 60) | lue comme le report des transports en commun vers les modes actifs, sur les passagers.km en transport en commun (Laurent, CGDD) |
| `transport_personnes_report_modal`, `transport_personnes_sobriete_deplacements` | `DonneesReference!G37` | « une partie du poste amont à déterminer » pour l'électricité du ferré, sans valeur | amont × 67,4 %, valeur que fixe la documentation fonctionnelle (p. 65) |
| `transport_marchandises_efficacite` | `TrsptMarch_Efficacité!B13` | le texte dit « somme », le dessin donne un produit | produit : 15,9 % contre 16,6 % dans un cas de test |
| `transport_marchandises_report_modal` | formes de `TrsptMarch_ReportModal` | le dessin croise les facteurs ferroviaire et fluvial ; les coefficients 0,8064, 1,0164, 0,8176 et 0,9576 s'expliquent par la documentation fonctionnelle (pp. 64-65 : distances ×1,21 et ×1,14, part routière 16 %, part de l'autre mode 84 %), issue d'une analyse interne ADEME non publiée | ferroviaire avec `FE_TFM`, fluvial avec `FE_TFlM`, comme le Scénario global |
| `transport_marchandises_electrification` | forme de `TrsptMarch_Electrification`, `DonneesReference!D38`, `C40`, `D27` | le dessin multiplie le facteur thermique par le taux de chargement ; `D38` l'exprime par véhicule.km alors que `C40` et `D27` le libellent en « kgeqCO2/t.km » | division par le taux de chargement : la multiplication donnerait 5,2 kgCO2e/t.km au lieu de 0,080 |
| `transport_marchandises_sobriete_logistique`, `transport_marchandises_report_modal`, `transport_marchandises_efficacite`, `transport_marchandises_electrification` | `FE_transports!A22` | le type de mobilité par défaut est « domicile-travail » ; l'onglet ne nomme pas le fret | route et ville (070302PL et 070303PL) appliqués aux poids lourds |
