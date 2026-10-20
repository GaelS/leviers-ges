# leviers-ges

Les formules du tableur ADEME PlanET V1 (21 leviers de décarbonation) sous forme de fonctions TypeScript. Une requête par levier, en retour les tonnes de CO2e évitées par an pour une région, un département ou un EPCI.

17 leviers sont calculés. Les quatre autres (`pratiques_stockantes`, `occupation_des_sols`, `residentiel_renovation`, `residentiel_changement_systeme_chauffage`) ne le sont à aucun niveau.

Le paquet n'est pas publié (`private: true`). Node ≥ 24 et pnpm.

## Utilisation

```ts
import { createCsvDataSource, createEstimator } from './src/index.ts'

const estimate = createEstimator(createCsvDataSource('./data'))
```

`estimate` est la seule fonction à appeler, pour tous les leviers. Elle renvoie un `Result` de `neverthrow` : jamais d'exception.

### Un levier sans territoire

```ts
const result = estimate({
  id: 'haies',
  parameters: { hedgeKmCreatedPerYear: '100' },
})
```

`result.value.reduction.toFixed()` vaut `'117'` (tCO2e par an).

### Un levier par territoire

```ts
const result = estimate({
  id: 'transport_marchandises_report_modal',
  territory: { level: 'region', code: '84' },
  parameters: { roadToRailFraction: '0.1', roadToWaterwayFraction: '0.05' },
})
```

`result.value.reduction.toFixed()` vaut `'248249.26'`. `result.value.appliedAssumptions` liste les hypothèses appliquées, chacune avec sa valeur, sa source et sa limite.

### Un niveau non calculé

```ts
const result = estimate({
  id: 'fertilisation_azotee',
  territory: { level: 'epci', code: '200046977' },
  parameters: { nitrogenReductionFraction: '0.1' },
})
```

`result.error` vaut `{ kind: 'level_not_computed', lever: 'fertilisation_azotee', level: 'epci' }`.

### Une requête invalide

```ts
const result = estimate({ id: 'haies', parameters: { hedgeKmCreatedPerYear: 'abc' } })
```

`result.error` vaut `{ kind: 'invalid_request', issues: [{ parameter: 'parameters.hedgeKmCreatedPerYear', message: 'must be a decimal number' }] }`.

## Règles de la requête

- `id` : l'identifiant du levier. `territory` : `{ level: 'region' | 'departement' | 'epci', code }`, absent pour `haies`.
- Les nombres se passent en texte (`'0.1'`) ou en nombre. Les fractions vont de 0 à 1.
- Un schéma refuse toute clé inconnue : `wasteReductionFraction` n'existe pas, `dechets_sobriete` prend `storageReductionFraction` et `incinerationReductionFraction`.
- `reduction` est un `BigNumber` arrondi à deux décimales.
- `level_not_computed`, `missing_data` (territoire sans donnée, par exemple l'outre-mer) et `invalid_request` sont les erreurs de l'estimation. Les types sont exportés (`EstimationError`, `DataSourceError`).

## Les leviers

Le détail d'un levier (formule, constantes sourcées, données, limites, cas de test) est dans son `src/levers/<dossier>/methodology.md`.

| `id` | Niveaux calculés |
|---|---|
| `batiments_machines_agricoles`, `reseaux_chaleur`, `dechets_mode_de_traitement`, `dechets_sobriete` | région, département, EPCI |
| `transport_personnes_sobriete_deplacements`, `transport_personnes_report_modal`, `transport_personnes_efficacite`, `transport_personnes_electrification` | région, département, EPCI |
| `fertilisation_azotee`, `elevage_durable`, `produits_bois`, `residentiel_sobriete` | région, département |
| `transport_marchandises_sobriete_logistique`, `transport_marchandises_report_modal`, `transport_marchandises_efficacite`, `transport_marchandises_electrification` | région |
| `haies` | sans territoire |

Tous les paramètres sont de la forme `parameters: { … }`. Une « fraction » va de 0 à 1 (`'0.1'` = 10 %). Un paramètre est obligatoire sauf mention « facultatif ».

## Référence des paramètres

### Agriculture et bois

| `id` | Paramètre | Sens |
|---|---|---|
| `batiments_machines_agricoles` | `electricityReductionFraction`, `naturalGasReductionFraction`, `petroleumProductsReductionFraction`, `heatReductionFraction` | fraction de baisse de chaque vecteur d'énergie. Les quatre sont obligatoires : un vecteur qu'on ne réduit pas se saisit à `'0'` |
| `fertilisation_azotee` | `nitrogenReductionFraction` | fraction de baisse de la masse d'azote livrée |
| `haies` | `hedgeKmCreatedPerYear` | kilomètres de haies créés par an ; une valeur négative (arrachage net) est admise et donne une réduction négative |
| `produits_bois` | `woodProductionIncrease` | variation relative de la production de produits bois (`'0.1'` = +10 %, `'-0.1'` = −10 %), sans borne ; une seule valeur pour le bois d'œuvre et le bois d'industrie |

### Élevage durable

`parameters.animals` associe à chaque type d'animal que la requête change un objet de trois champs. Au moins un type est obligatoire ; un type absent ne change pas et n'apporte rien.

| Champ | Sens |
|---|---|
| `headcountReductionFraction` | fraction du cheptel en moins (obligatoire) |
| `entericEmissionReductionFraction` | fraction de baisse du facteur de fermentation entérique (facultatif, `'0'` par défaut) |
| `targetManureShares` | répartition visée des déjections : `liquid` (lisier), `solid` (fumier), `pasture` (pâture), `anaerobicDigestion` (méthanisation). Quatre fractions dont la somme vaut exactement 1 (obligatoire) |

Les onze types, avec la répartition actuelle supposée par le tableur (lisier / fumier / pâture, méthanisation à 0) :

| Type | Animal | Lisier | Fumier | Pâture | Lisier admis | Méthanisation admise |
|---|---|---|---|---|---|---|
| `dairyCows` | vaches laitières | 41 % | 20 % | 39 % | oui | oui |
| `otherCattle` | autres bovins | 27 % | 30 % | 43 % | oui | oui |
| `sows` | truies | 88 % | 10 % | 2 % | oui | oui |
| `otherPigs` | autres porcins | 93 % | 6 % | 1 % | oui | oui |
| `goats` | caprins | 0 % | 88 % | 12 % | non | non |
| `sheep` | ovins | 0 % | 26 % | 74 % | non | non |
| `horses` | chevaux | 0 % | 42 % | 58 % | non | non |
| `mulesAndDonkeys` | mules et ânes | 0 % | 42 % | 58 % | non | non |
| `layingHens` | poules pondeuses | 3 % | 90 % | 7 % | oui | non |
| `broilers` | poulets | 3 % | 90 % | 7 % | oui | non |
| `otherPoultry` | autres volailles | 3 % | 90 % | 7 % | oui | non |

Une répartition qui met du lisier sur un type « non », ou de la méthanisation hors bovins et porcins, est refusée.

```ts
const result = estimate({
  id: 'elevage_durable',
  territory: { level: 'region', code: '53' },
  parameters: {
    animals: {
      dairyCows: {
        headcountReductionFraction: '0.1',
        entericEmissionReductionFraction: '0.05',
        targetManureShares: { liquid: '0.2', solid: '0.3', pasture: '0.4', anaerobicDigestion: '0.1' },
      },
      sheep: {
        headcountReductionFraction: '0.2',
        targetManureShares: { liquid: '0', solid: '0.26', pasture: '0.74', anaerobicDigestion: '0' },
      },
    },
  },
})
```

`result.value.reduction.toFixed()` vaut `'747377.9'`. Un lisier sur des caprins donne `{ kind: 'invalid_request', issues: [{ parameter: 'parameters.animals.goats.targetManureShares.liquid', message: 'liquid manure is not an available management mode for goats' }] }`.

### Résidentiel et réseaux de chaleur

| `id` | Paramètre | Sens |
|---|---|---|
| `residentiel_sobriete` | `householdsApplyingSobrietyFraction` | fraction des ménages qui appliquent la sobriété |
| | `consumptionReductionFraction` | fraction de baisse de leur consommation (pas de valeur par défaut) |
| `reseaux_chaleur` | `emissionFactorReductionFraction` | fraction de baisse du facteur d'émission des réseaux ; au-delà de 1 la requête est refusée |

### Transport de personnes

`railShareFraction` (facultatif, fraction) est la part du ferré dans le transport en commun. Sans lui, 82 % en Île-de-France et 24 % ailleurs, valeur renvoyée dans `appliedAssumptions.railShare`.

| `id` | Paramètre | Sens |
|---|---|---|
| `transport_personnes_sobriete_deplacements` | `commutingDistanceReductionFraction` | fraction de baisse des distances domicile-travail (voiture et transport en commun) |
| | `railShareFraction` | facultatif |
| `transport_personnes_report_modal` | `carToPublicTransportFraction` | fraction des passagers.km en voiture reportée vers le transport en commun |
| | `carToActiveModesFraction` | fraction des passagers.km en voiture reportée vers les modes actifs ; la somme des deux reports ne dépasse pas 1 |
| | `railShareFraction` | facultatif |
| `transport_personnes_efficacite` | `carEcodrivingApplicationFraction`, `busEcodrivingApplicationFraction` | part d'application de l'écoconduite (voitures, bus et cars) |
| | `carPassengerIncrease`, `busPassengerIncrease` | hausse relative du nombre de passagers par véhicule (`'0.2'` = +20 %), 0 ou plus, sans plafond |
| | `railShareFraction` | facultatif |
| `transport_personnes_electrification` | `carElectrificationFraction` | fraction du parc de voitures à électrifier ; plafonnée à la part thermique du parc, valeur renvoyée dans `appliedAssumptions` quand le plafond joue |
| | `busElectrificationFraction` | idem pour le parc de bus et cars |
| | `railShareFraction` | facultatif |

### Transport de marchandises

| `id` | Paramètre | Sens |
|---|---|---|
| `transport_marchandises_sobriete_logistique` | `roadFreightReductionFraction` | fraction de baisse des tonnes.kilomètres routières |
| `transport_marchandises_report_modal` | `roadToRailFraction`, `roadToWaterwayFraction` | fractions des t.km routières reportées vers le ferroviaire et le fluvial ; la somme ne dépasse pas 1 |
| | `cyclologisticTonneKilometres` | t.km reportées vers la cyclologistique (facultatif, `'0'` par défaut, positif ou nul) |
| `transport_marchandises_efficacite` | `ecodrivingApplicationFraction` | part d'application de l'écoconduite |
| | `loadFactorIncrease` | hausse relative du chargement (`'0.2'` = +20 %), 0 ou plus, sans plafond |
| `transport_marchandises_electrification` | `additionalElectrifiedFleetFraction` | points de parc de poids lourds électrifiés en plus ; plafonnée à la part thermique du parc de la région |

### Déchets

| `id` | Paramètre | Sens |
|---|---|---|
| `dechets_mode_de_traitement` | `storageToIncinerationFraction` | fraction des tonnes stockées envoyées vers l'incinération |
| | `storageToMaterialRecoveryFraction` | fraction des tonnes stockées envoyées vers la valorisation ; la somme des deux ne dépasse pas 1 |
| | `incinerationToMaterialRecoveryFraction` | fraction des tonnes incinérées avec récupération envoyées vers la valorisation |
| `dechets_sobriete` | `storageReductionFraction` | fraction de baisse des tonnes stockées |
| | `incinerationReductionFraction` | fraction de baisse des tonnes incinérées avec récupération |

## Commandes

| Commande | Rôle |
|---|---|
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint, dont les règles de calcul scientifique et de couches |
| `pnpm test:coverage` | vitest, seuil de 100 % sur `src/` |
| `pnpm build` | `dist/` |
| `pnpm build:data:<jeu>` | reconstruit un jeu de `data/` depuis ses sources versionnées |

## Pour aller plus loin

- `AGENTS.md` : l'architecture, les règles de code et comment ajouter un levier.
- `docs/methodology/` : conventions de calcul, hypothèses nommées, corrections de formule, `points-a-arbitrer.md` (tout ce qui s'écarte du tableur ou reste à confirmer).
