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

| `id` | Paramètres | Niveaux |
|---|---|---|
| `batiments_machines_agricoles` | `electricityReductionFraction`, `naturalGasReductionFraction`, `petroleumProductsReductionFraction`, `heatReductionFraction` | région, département, EPCI |
| `dechets_mode_de_traitement` | `storageToIncinerationFraction`, `storageToMaterialRecoveryFraction`, `incinerationToMaterialRecoveryFraction` | région, département, EPCI |
| `dechets_sobriete` | `storageReductionFraction`, `incinerationReductionFraction` | région, département, EPCI |
| `elevage_durable` | `animals` : par type d'animal, `headcountReductionFraction`, `entericEmissionReductionFraction`, `targetManureShares` | région, département |
| `fertilisation_azotee` | `nitrogenReductionFraction` | région, département |
| `haies` | `hedgeKmCreatedPerYear` | sans territoire |
| `produits_bois` | `woodProductionIncrease` | région, département |
| `reseaux_chaleur` | `emissionFactorReductionFraction` | région, département, EPCI |
| `residentiel_sobriete` | `householdsApplyingSobrietyFraction`, `consumptionReductionFraction` | région, département |
| `transport_marchandises_sobriete_logistique` | `roadFreightReductionFraction` | région |
| `transport_marchandises_report_modal` | `roadToRailFraction`, `roadToWaterwayFraction`, `cyclologisticTonneKilometres` (optionnel) | région |
| `transport_marchandises_efficacite` | `ecodrivingApplicationFraction`, `loadFactorIncrease` | région |
| `transport_marchandises_electrification` | `additionalElectrifiedFleetFraction` | région |
| `transport_personnes_sobriete_deplacements` | `commutingDistanceReductionFraction`, `railShareFraction` (optionnel) | région, département, EPCI |
| `transport_personnes_report_modal` | `carToPublicTransportFraction`, `carToActiveModesFraction`, `railShareFraction` (optionnel) | région, département, EPCI |
| `transport_personnes_efficacite` | `carEcodrivingApplicationFraction`, `busEcodrivingApplicationFraction`, `carPassengerIncrease`, `busPassengerIncrease`, `railShareFraction` (optionnel) | région, département, EPCI |
| `transport_personnes_electrification` | `carElectrificationFraction`, `busElectrificationFraction`, `railShareFraction` (optionnel) | région, département, EPCI |

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
