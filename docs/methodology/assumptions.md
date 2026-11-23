# Registre des hypothèses

Une question ouverte devient une hypothèse nommée, avec sa valeur de contournement. Une réponse de l'ADEME change la valeur par défaut, pas le code. Chaque levier concerné renvoie dans `appliedAssumptions` la valeur réellement utilisée. Aucune requête n'accepte encore de surcharger une hypothèse : la valeur par défaut est fixée dans le code du levier.

## Hypothèses nommées

| Nom | Question | Défaut | Leviers concernés |
|---|---|---|---|
| `nitrogenCampaigns` | L'azote livré par département porte-t-il sur 2023 (tableur) ou sur deux campagnes ? Une moyenne sur deux ans vaut-elle aussi pour la région ? | région, département et EPCI : moyenne de la campagne 2022-2023 révisée et de la campagne 2023-2024 (UNIFA) ; la campagne 2022-2023 est déduite de l'évolution publiée, azote 2023-2024 ÷ (1 + évolution) | `fertilisation_azotee` |
| `methanisationFactors` | Quels facteurs pour la méthanisation ? Les documents cités n'en donnent que pour lisier, fumier et pâture | OMINEA 2026 (CITEPA) : FCM 2,27 %, FD 0,0006 kg N-N2O/kg N excrété, pour bovins et porcins ; indisponible pour les autres animaux | `elevage_durable` |
| `railElectricityUpstreamShare` | Quelle part du poste amont de l'électricité du transport ferré compter ? Résolue le 2026-11-19 par la documentation fonctionnelle PlanET (p. 65) | amont × 67,4 % : Base Empreinte, TER 2022 (élément 43255), amont 0,0229 × 67,4 % = 0,0154346 kgCO2e/passager.km (fabrication 0,00479 non comptée, combustion nulle) ; Corse 0,187 inchangé | transport de personnes : sobriété des déplacements, report modal |
| `electricVehicleEmissionFactors` | Quelle ligne de la Base Empreinte pour les facteurs électriques ? | l'amont seul, sans la fabrication : voiture électrique compacte 2021, 0,0133 kgCO2e/km (élément 28007) ; bus électrique, 0,0095 kgCO2e/passager.km | transport de personnes : électrification |
| `heavyVehicleLoadFactor` | Quelle valeur « SNBC 3 » du taux de chargement des poids lourds ? | 8,1 t (guide SGPE du 16/02/2024, p. 37 ; 8,1 t en 2019, 8,7 t en cible 2030) | transport de marchandises : les quatre leviers |
| `wasteScope` | Les tonnes de déchets sont-elles celles collectées sur le territoire (`A25`) ou celles des sites de traitement présents sur le territoire (`L21`) ? Confirmée le 2026-11-19 par Laurent (réponse du CGDD au document du 29 octobre 2026) et par la documentation fonctionnelle (p. 68) | les sites : registre IREP 2022 de Géorisques (déchets non dangereux du chapitre 20), rattachés au territoire par la commune du site ; facteurs de la feuille `FE_déchets` du tableur | `dechets_mode_de_traitement`, `dechets_sobriete` |
| `passengerCarLastLineKept` | La dernière ligne de la formule du report modal des voitures est-elle à garder ? Résolue le 2026-11-19 par la réponse de Laurent (CGDD) au document du 29 octobre 2026 : coquille, la ligne est le report des transports en commun vers les modes actifs, sur les passagers.km en transport en commun | la ligne est calculée comme un troisième report, `PK_TC × 52,14 × r_TC→actifs × FE_TC` ; la requête porte `publicTransportToActiveModesFraction` | transport de personnes : report modal |
| `heavyVehicleTripType` | Trajet de poids lourds en courte ou en longue distance, et quelle maille de parc ? Résolue le 2026-11-19 par le tableur (`FE_transports!A22` et `A31`), auquel renvoie le CGDD | type de trajet par défaut, route et ville (070302PL et 070303PL), parc de la région : OMINEA 2024, poids lourds diesel, 854,4 g CO2/véhicule.km ÷ 8,1 t, soit 0,1055 kgCO2e/t.km (0,0796 en longue distance, 24,5 % de moins) ; parc au 1er janvier 2024 (RSVERO, SDES) | transport de marchandises : les quatre leviers |
| `applicationSurfaceBounds` | Quelle borne pour la surface d'application d'une pratique stockante ? | aucune : chaque surface est prise telle que saisie, à partir de 0 ha (documentation fonctionnelle, p. 78 : pas de borne documentée) | pratiques stockantes |
| `includeInternationalFlows` | Les flux avec l'étranger comptent-ils dans les tonnes-kilomètres rapportées à la région ? Confirmée dans son principe le 2026-11-19 par la documentation fonctionnelle (p. 63) : moitié des tonnes.km chargées et moitié des déchargées. La documentation affecte en plus les importations à 100 % à la région de destination : règle non vérifiée dans le jeu SDES, voir `points-a-arbitrer.md` | avec l'étranger : trafic interne + 50 % du trafic chargé ou déchargé dans la région (SDES, jeu `reg_type_flux`, 2024) ; de +18 % (Corse) à +62 % (Hauts-de-France) | transport de marchandises : les quatre leviers |
| `occupationDesSolsReferenceAreas` | Comment répartir l'afforestation et les zones humides entre les types de prairie, quel type ALDO est le « sol artificialisé enherbé », et que vaut un terme sans surface de référence ? Le tableur dit seulement « au prorata des surfaces existantes » | trois types de prairie ALDO au prorata de leurs surfaces ; enherbé = « sols artificiels arbustifs » ; terme sans surface de référence : 0 | `occupation_des_sols` |
| `nationalHeatingShares` | Quelle énergie de chauffage par vecteur et par territoire, le CEREN n'étant pas ouvert ? | part nationale du chauffage dans la consommation résidentielle de chaque vecteur (SDES, Conso_usage, 2024, à climat réel, PCI) : électricité 30,3 %, gaz naturel 79,9 %, fioul 88,6 %, chaleur 91,1 %, bois 0 ; GPL non modifié | `residentiel_changement_systeme_chauffage` |

## Questions sans contournement, hors périmètre

Cette question bloque le calcul. Le levier concerné n'a aucune variante de `Request` et ses trois niveaux sont `not_computed`.

| Levier | Ce qui manque | Pourquoi aucun contournement |
|---|---|---|
| Résidentiel, rénovation | la consommation par m² des logements avant rénovation, par type de logement, chauffage et période de construction, par département (le tableur la renvoie au CEREN, « Pas disponible en open source ») | le fichier national gratuit n'a pas le chauffage principal |

Pratiques stockantes est aussi `not_computed` aux trois niveaux, pour une autre raison : son périmètre de validité est « LIMITEE » à chaque maille, sans commentaire ni surface applicable.

## Règle d'usage

| Règle | Détail |
|---|---|
| Valeur par défaut | définie une fois, dans le module du levier, avec son commentaire `Source :` |
| Valeur transmise | validée par `zod` ; le type de `Request` du levier ne porte que les hypothèses de ce levier |
| Traçabilité | `appliedAssumptions` du résultat contient la valeur utilisée, même quand c'est le défaut |
| Réponse reçue | on change la valeur par défaut et la source citée ; la ligne du registre passe en « résolue » avec la date |
