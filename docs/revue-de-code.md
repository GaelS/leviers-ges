# Revue de code

Ce que le lint ne peut pas vérifier. Le relecteur le juge, PR par PR. Le but : le code le plus lisible possible, pour un calcul scientifique où chaque valeur et chaque source de données se justifie.

## Ce que le lint vérifie déjà

Ne pas le relire à la main.

| Règle | Effet |
|---|---|
| `no-magic-numbers` | aucun littéral numérique hors `0` et `1` |
| décimaux en constante | un décimal passé à `quantity`, `toBig` ou `new Big` vit dans une constante en majuscules |
| `local/constant-has-source` | toute constante en majuscules porte un `// Source :` contigu |
| pas de flottant | ni opérateurs arithmétiques, ni `Math`, `Number`, `parseFloat`, `.toNumber()` |
| une opération par expression | pas de `a.times(b).plus(c)` : chaque composante est nommée |
| barrel | un levier s'importe par son `index.ts` |
| couches | `domain`, `application`, `levers` et `calculate-*` ne dépendent que de ce qui est en dessous |

## Ce que le relecteur juge

### 1. Un appel qui revient devient une fonction nommée

Une suite « accès, puis callback » écrite plus d'une fois, ou qui obscurcit l'intention, devient une petite fonction au nom explicite. Le contexte d'estimation expose ces fonctions ; un levier ne manipule pas l'index des territoires.

```ts
territoryIndex().andThen((index) => index.communesOf(territory))
getCommunesOf(territory)
```

### 2. Une préoccupation par fichier

Le calcul pur, la lecture des données, l'orchestration et le schéma de la requête sont des fichiers distincts. Un fichier qui lit des données et calcule, ou qui valide et calcule, se découpe.

| Fichier d'un levier | Rôle |
|---|---|
| `calculate-*.ts` | formule pure, valeurs en entrée |
| `read-*.ts` | lecture et filtrage des données |
| `<levier>-request.ts` | schéma de la requête |
| `estimate.ts` | enchaîne les étapes, ne contient ni formule ni lecture |

### 3. Un levier, un dossier, un barrel

Le dossier `src/levers/<levier>/` regroupe tout ce qui le concerne, méthodologie comprise. Son `index.ts` n'expose que `estimate` et le type de son entrée. Un levier n'importe jamais un autre levier : ce qui se partage monte dans `domain` ou `application`.

### 4. La méthodologie vit à côté du code

La fiche d'un levier est `src/levers/<levier>/methodology.md`. Seuls les documents qui concernent plusieurs leviers restent dans `docs/methodology/`.

### 5. Pas de fabrique sans besoin

Un levier expose `estimate(entrée, contexte)`. Une fabrique `createXEstimator(...)` n'apparaît que le jour où un état à partager l'exige.

### 6. On écrit le type voulu, on ne le déduit pas

`RequestInput` est l'union explicite des entrées des leviers. Aucune inférence depuis la signature d'une implémentation.

```ts
type RequestInput = HaiesRequestInput | ReseauxChaleurRequestInput
```

### 7. Un type de marque se fabrique par zod

`.brand()` sur le schéma, jamais un cast. Un `as` n'est admis que dans les tests.

### 8. Le nom dit la grandeur

Chaque composante d'un calcul est une variable dont le nom dit ce qu'elle représente (`emissionsInTonnes`, `deliveredMwh`), avant d'être combinée. Un nom générique (`result`, `value`, `data`) est refusé.

### 9. Aucun commentaire hors `// Source :`

Le nom, le type ou une fonction courte dit ce que le code fait. Un commentaire qui explique, justifie ou résume est supprimé.

### 10. Chaque valeur et chaque choix se justifient

Le lint contrôle la présence d'un `// Source :`, pas sa vérité. Le relecteur vérifie que :

| Point | Attendu |
|---|---|
| Valeur | la source cite le document, la page, le tableau ou la cellule |
| Choix de modélisation sans source | dit « choix de conception, non validé » |
| PR | liste ces choix dans « À arbitrer » |
| Interprétation du tableur | jamais faite en silence : elle est signalée |

### 11. Les données se reconstruisent depuis le dépôt

Les sources sont versionnées avec leur empreinte dans le manifeste. Le script de construction est en TypeScript, testé, et reproduit le fichier à l'identique. Pas de Python, pas de source hors dépôt.

### 12. Full TypeScript

Les imports relatifs portent l'extension `.ts`, jamais `.js`. Les scripts du dépôt sont en TypeScript.

### 13. Un objet inconnu se valide par zod

Pas de test d'objet écrit à la main (`isRecord`, `typeof input['id'] === 'string'`, `Object.hasOwn`). Une valeur de forme inconnue passe par un schéma zod (`safeParse`) : le schéma dit la forme attendue, le type en sort, l'erreur est typée.

```ts
function isRoutedLever(input: unknown): input is RequestInput {
  return isRecord(input) && typeof input['id'] === 'string' && Object.hasOwn(routedLevers, input['id'])
}
```

Le routage de `src/estimator/estimate.ts` valide l'`id` par un schéma zod (`routedLeverSchema`), à la place du garde ci-dessus.

### 14. Une écriture évidente plutôt qu'un tableau d'appels

Un résultat se construit en constantes nommées, une par composante, puis on les assemble. Pas de tableau littéral qui répète un appel avec d'autres arguments, où les composantes n'ont pas de nom.

```ts
const electricityAvoidedEmissions = calculateAvoidedEmissions({ ... })
const naturalGasAvoidedEmissions = calculateAvoidedEmissions({ ... })
const avoidedEmissionsByVector = [electricityAvoidedEmissions, naturalGasAvoidedEmissions]
const totalAvoidedEmissions = sum(avoidedEmissionsByVector)
```

## Liste de contrôle

- [ ] Un appel qui revient a un nom (1)
- [ ] Chaque fichier a une seule préoccupation (2)
- [ ] Le barrel n'expose que `estimate` et son type d'entrée (3)
- [ ] La méthodologie est à côté du code (4)
- [ ] Pas de fabrique sans besoin (5)
- [ ] Les types sont écrits, pas inférés (6)
- [ ] Aucun cast hors tests (7)
- [ ] Les noms disent la grandeur (8)
- [ ] Aucun commentaire hors `// Source :` (9)
- [ ] Les sources sont vraies et les choix non validés sont dits (10)
- [ ] Les données se reconstruisent depuis le dépôt (11)
- [ ] Imports en `.ts` et scripts en TypeScript (12)
- [ ] Un objet inconnu se valide par zod, pas par un test écrit à la main (13)
- [ ] Un résultat se construit en constantes nommées, pas en tableau d'appels (14)
