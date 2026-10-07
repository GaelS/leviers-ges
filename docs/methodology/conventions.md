# Conventions

Règles communes à tous les leviers. Une fiche de levier ne les répète pas ; elle ne note que ses écarts.

## Calcul

| Règle | Détail |
|---|---|
| Type numérique | `BigNumber` (`bignumber.js`) pour toute valeur de calcul. Jamais de `number` dans une formule |
| Instance | une seule, créée par `BigNumber.clone` dans le noyau, avec la précision de division et le mode d'arrondi fixés une fois |
| Construction | une valeur se construit depuis une chaîne (`new BigNumber('0.1')`), jamais depuis un `number` flottant |
| Arrondi | un seul, en sortie de `estimate`. Aucun arrondi intermédiaire |
| Contrôle en développement | `BigNumber.DEBUG` actif hors production : une construction depuis un `number` à plus de 15 chiffres significatifs échoue |
| Entrées publiques | `number` ou texte acceptés à la frontière, validés par `zod`, convertis en `BigNumber` brandé avant toute formule |

## Unités

| Grandeur | Convention |
|---|---|
| Pourcentage de la méthode | fraction entre 0 et 1 (`0.25` pour 25 %), type `Fraction`. Le pourcentage affiché est une affaire d'interface |
| Émissions | `tCO2e` par an en sortie ; les facteurs gardent l'unité de leur source dans leur type (`kgCO2e/tkm`, `gCO2e/passager.km`) et la conversion se fait dans la formule |
| Réduction | valeur positive pour une émission évitée |
| Distances, tonnages, surfaces | un type brandé par unité (`Kilometres`, `Tonnes`, `TonneKilometres`, `Hectares`). Un facteur passé à la place d'une quantité ne compile pas |

## Territoires

| Règle | Détail |
|---|---|
| Niveau | `Level = 'departement' | 'epci' | 'region'` |
| Territoire | `Territory<M extends Level> = { level: M; code: TerritoryCode }`, code INSEE |
| Statut par niveau | `Status = 'no_open_question' | 'workaround' | 'not_computed'`, registre `LEVERS` (21 leviers × 3 niveaux = 63 statuts) |
| Niveau non calculé | `estimate` renvoie `LevelNotComputed` ; le type de `Request` interdit déjà ce niveau à la compilation pour les leviers calculables |
| Corse | codes `2A` et `2B` regroupés dans une table de passage versionnée |
| EPCI à cheval sur plusieurs départements | 89 EPCI : les jeux EPCI donnent une ligne par couple EPCI et département, et la somme se fait par département. Le traitement propre à chaque levier est dans sa fiche |

## Données

| Règle | Détail |
|---|---|
| Dossier | `data/<levier ou source>/` : un CSV par jeu et un `manifest.json` |
| Format du CSV | UTF-8, séparateur virgule, point décimal, ligne d'en-tête |
| Précision | chaque valeur est arrondie à la précision de sa source ; la précision est notée dans le manifeste. Un test échoue si un CSV contient une valeur décimale à plus de 12 chiffres après la virgule (bruit de flottant, par exemple `56.25000000000001`) |
| Manifeste | source, lien, millésime, date de relevé, total de contrôle, unité de chaque colonne |
| Contenu | des agrégats par territoire, pas les fichiers bruts (jusqu'à 524 Mo). L'étape de construction des agrégats rejoint le dépôt |
| Lecture | `csv-parse` ; les valeurs restent du texte jusqu'à la formule qui les passe en `BigNumber` ; un index `Map` par jeu et par code de territoire ; chaque levier charge ses seuls fichiers, au premier usage |
| Contrôle au chargement | le total de contrôle du manifeste est vérifié ; un écart est une erreur typée `MissingData` |

## Constantes et sources

Chaque constante exportée est précédée d'un commentaire `Source :` qui cite le document, le tableau, la page ou la cellule d'où vient la valeur. C'est la seule exception à la règle « zéro commentaire » du dépôt, limitée aux constantes. Un test parcourt les fichiers et échoue si une constante exportée n'en porte pas.

```ts
// Source : Label bas carbone, méthode Haies, webinaire du 25/01/2021 p. 6 :
// carbone du sol 0,77 + biomasse racinaire 0,4 tCO2e/km/an (bornes basses)
export const HEDGE_STORAGE_FACTOR = ...
```

## Erreurs

| Cas | Traitement |
|---|---|
| Paramètre invalide, niveau non calculé, donnée absente | `Result` (`neverthrow`) : `InvalidParameter`, `LevelNotComputed`, `MissingData` |
| Formule sur entrées validées | totale, sans `Result` |
| Invariant violé (bug) | `throw` |

## Nommage

Tout le code est en anglais : fonctions, types, paramètres, hypothèses, constantes, ports, statuts, schémas. Restent en français :

| Reste en français | Exemples |
|---|---|
| les `id` de levier | `'haies'`, `'fertilisation_azotee'` |
| les valeurs de `Level` | `'departement'`, `'epci'`, `'region'` |
| les identifiants dérivés d'un `id` de levier | `HaiesRequest`, `calculateHaiesReduction`, dossiers `haies/`, `fertilisation-azotee/` |

Les commentaires `Source :` citent les documents dans leur langue. Les fichiers et dossiers sont en `kebab-case`.
