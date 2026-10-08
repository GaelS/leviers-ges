# leviers-ges

Les formules du tableur ADEME PlanET V1 (21 leviers de décarbonation) deviennent des fonctions pures TypeScript. On envoie une requête par levier, on reçoit les tonnes de CO2e évitées par an, pour une région, un département ou un EPCI. Le tableur fait foi : toute interprétation nouvelle se signale, elle ne se fait pas en silence.

Node ≥ 24, pnpm, TypeScript strict, `bignumber.js` pour tout calcul, aucune base de données (CSV en mémoire).

## Commandes

| Commande | Rôle |
|---|---|
| `pnpm typecheck` | `tsc --noEmit` |
| `pnpm lint` | ESLint, dont les règles de calcul scientifique et de couches |
| `pnpm test:coverage` | vitest, seuil de 100 % sur `src/` |
| `pnpm build` | `dist/` (sans les constructeurs de données) |
| `pnpm build:data:reseaux-chaleur` | reconstruit `data/reseaux-chaleur/networks.csv` depuis ses sources |

Une PR passe les quatre premières.

## Où chercher quoi

| Dossier | Contenu |
|---|---|
| `src/levers/<levier>/` | tout un levier : requête, calcul pur, lecture des données, `estimate`, tests, `methodology.md` |
| `src/estimator/` | `createEstimator(dataSource)` : choisit le levier par son `id` |
| `src/application/` | aides partagées : validation de la requête, contexte d'estimation (`getCommunesOf`), erreurs, index des territoires |
| `src/domain/` | noyau : `BigNumber`, unités brandées, territoires, registre `LEVERS` (21 leviers × 3 niveaux), port `DataSource` |
| `src/infrastructure/csv/` | adaptateur CSV : manifeste, empreintes sha256, contrôles au chargement |
| `src/dataset-builders/` | scripts TypeScript qui reconstruisent un jeu de `data/` depuis ses sources |
| `src/testing/` | aides de test, dont `createTemporaryCsvDataSource` |
| `data/<jeu>/` | CSV et `manifest.json` (source, empreinte, unités, totaux de contrôle) |
| `eslint-rules/` | règle locale `constant-has-source` et son test |
| `docs/methodology/` | ce qui concerne plusieurs leviers : `conventions.md`, `assumptions.md`, `formula-corrections.md` |
| `docs/revue-de-code.md` | ce que le relecteur juge et que le lint ne vérifie pas |

## Les leviers

Chacun a son `src/levers/<id>/methodology.md` : sa formule, ses entrées, ses constantes sourcées, ses données et leurs limites, ses cas de test chiffrés. Pour comprendre un levier, c'est le premier fichier à lire.

| `id` | État | Pour creuser |
|---|---|---|
| `batiments_machines_agricoles` | fait | `src/levers/batiments-machines-agricoles/methodology.md` |
| `haies` | fait | `src/levers/haies/methodology.md` |
| `reseaux_chaleur` | fait | `src/levers/reseaux-chaleur/methodology.md` |
| les 14 autres leviers calculables | à faire | statut par niveau dans `src/domain/lever-registry.ts` |

`pratiques_stockantes`, `occupation_des_sols`, `residentiel_renovation` et `residentiel_changement_systeme_chauffage` ne sont pas calculés (`not_computed` partout).

Les fiches d'analyse (une par levier, figées) vivent hors de ce dépôt. Une question ouverte devient une hypothèse nommée avec son contournement dans `docs/methodology/assumptions.md` ; une formule corrigée par rapport au tableur est dans `docs/methodology/formula-corrections.md`.

## Règles à connaître avant de modifier

- Aucune valeur en `number` dans une formule : `BigNumber`, construit depuis un texte (`quantity`, `toBig`). Une opération `BigNumber` par expression, chaque composante nommée.
- Zéro commentaire, sauf `// Source :` au-dessus de chaque constante en majuscules, qui cite le document, la page ou la cellule. Un choix sans source le dit : « choix de conception, non validé ».
- Un levier ne s'importe que par son `index.ts`, qui n'expose que `estimate` et le type de son entrée. Un levier n'importe pas un autre levier.
- `calculate-*.ts` est pur : il reçoit des valeurs, jamais une source de données.
- Imports relatifs en `.ts`. Scripts en TypeScript, pas de Python.
- Une PR : un seul type de changement, un test rouge avant un correctif, une liste « À arbitrer » dans la description.

Le détail est dans `docs/methodology/conventions.md` (calcul, unités, données) et `docs/revue-de-code.md`.

## Ajouter un levier

1. Créer `src/levers/<id>/` avec `<id>-request.ts` (schéma `zod`), `calculate-<…>.ts`, `estimate.ts`, `index.ts` et les tests.
2. Brancher le levier dans `src/estimator/estimate.ts` : l'union `RequestInput`, `routedLevers`, le `match`. Le compilateur refuse un levier oublié.
3. S'il lit des données : un dossier `data/<jeu>/` avec manifeste, sources versionnées et constructeur dans `src/dataset-builders/`. Se tester avec `createTemporaryCsvDataSource`.
4. Écrire `src/levers/<id>/methodology.md` : formule, entrées, constantes avec leur source, données, cas de test chiffrés, limites.
5. Reporter dans `docs/methodology/` les hypothèses nommées et les corrections de formule qui concernent le levier.
