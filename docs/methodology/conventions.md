# Conventions

Règles communes à tous les leviers. Une fiche de levier ne les répète pas ; elle ne note que ses écarts.

## Calcul

| Règle | Détail |
|---|---|
| Type numérique | `BigNumber` (`bignumber.js`) pour toute valeur de calcul. Jamais de `number` dans une formule |
| Instance | une seule, créée par `BigNumber.clone` dans le noyau, avec la précision de division et le mode d'arrondi fixés une fois |
| Construction | une valeur se construit depuis une chaîne (`toBig('0.1')`), jamais depuis un `number` flottant : `toBig` et `quantity` n'acceptent que `string` ou `bigint` |
| Chaîne invalide | `STRICT: true` (v11 de `bignumber.js`) : une chaîne qui n'est pas un nombre lève une erreur. À la frontière, `parseBig` la renvoie en `Result` |
| Arrondi | un seul, en sortie de `estimate` (`roundOutput`, 2 décimales). Aucun arrondi intermédiaire |
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
| Manifeste | source, lien, millésime, date de relevé, somme sha256 du fichier, niveau des territoires (absent pour un jeu de constantes), colonne clé, colonnes et leur unité, totaux de contrôle optionnels par colonne. Les colonnes déclarées doivent être exactement celles du CSV |
| Jeu de constantes | colonnes `name` (clé) et `value` ; une valeur vide est une donnée absente |
| Contenu | des agrégats par territoire, pas les fichiers bruts (jusqu'à 524 Mo). L'étape de construction des agrégats rejoint le dépôt |
| Lecture | `csv-parse` ; les valeurs restent du texte jusqu'à la formule qui les passe en `BigNumber` ; un index `Map` par jeu et par code de territoire ; chaque levier charge ses seuls fichiers, au premier usage |
| Contrôle au chargement | somme sha256, colonnes, précision, totaux de contrôle, clés uniques et non vides : un écart est une erreur typée `InvalidDataset`. Un territoire absent d'un jeu valide est `MissingData`. Le niveau du territoire doit être celui du jeu |
| Valeurs refusées | plus de 12 décimales, virgule décimale, notation scientifique, jeu sans ligne |

## Constantes et sources

Chaque constante en majuscules, exportée ou locale, est précédée d'un commentaire `// Source :` qui cite le document, le tableau, la page ou la cellule d'où vient la valeur. C'est la seule exception à la règle « zéro commentaire » du dépôt, limitée aux constantes. La règle ESLint `local/constant-has-source` échoue si une constante n'en porte pas ; la revue vérifie que la source est exacte (voir `docs/revue-de-code.md`).

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
