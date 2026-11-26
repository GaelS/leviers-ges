import { match } from 'ts-pattern'
import type { Level } from '../../domain/territory.ts'
import type { EstimationError, InvalidRequest, InvalidRequestIssueCode } from './estimation-error.ts'

// Source : choix de conception, non validé : texte français de chaque code d'issue, destiné à l'utilisateur d'un service qui expose le paquet
const ISSUE_DESCRIPTIONS: Readonly<Record<InvalidRequestIssueCode, string>> = {
  not_an_object: 'la requête doit être un objet',
  unknown_lever: 'levier inconnu',
  unknown_parameter: 'paramètre inconnu',
  required: 'valeur obligatoire manquante',
  invalid_type: 'type de valeur invalide',
  not_a_decimal: 'nombre décimal attendu, en texte ou en nombre',
  out_of_range: 'valeur hors des bornes admises',
  invalid_combination: 'combinaison de valeurs invalide',
  invalid_value: 'valeur invalide',
}

// Source : choix de conception, non validé : nom français de chaque niveau de territoire
const LEVEL_NAMES: Readonly<Record<Level, string>> = {
  region: 'région',
  departement: 'département',
  epci: 'EPCI',
}

function describeIssues(issues: InvalidRequest['issues']): string {
  if (issues.length === 0) return 'Requête invalide.'
  const described = issues.map(({ parameter, code }) => `${parameter} : ${ISSUE_DESCRIPTIONS[code]}`)
  return `Requête invalide : ${described.join(' ; ')}.`
}

function describeEstimationError(error: EstimationError): string {
  return match(error)
    .with({ kind: 'invalid_request' }, ({ issues }) => describeIssues(issues))
    .with(
      { kind: 'level_not_computed' },
      ({ lever, level }) => `Le levier ${lever} n’est pas calculé au niveau ${LEVEL_NAMES[level]}.`,
    )
    .with(
      { kind: 'unknown_territory' },
      ({ level, code }) => `Territoire inconnu : ${LEVEL_NAMES[level]} « ${code} ».`,
    )
    .with(
      { kind: 'missing_data' },
      ({ dataset, key }) => `Aucune donnée pour « ${key} » dans le jeu ${dataset}.`,
    )
    .with(
      { kind: 'invalid_dataset' },
      ({ dataset, reason, detail }) => `Jeu de données ${dataset} invalide : ${reason} (${detail}).`,
    )
    .exhaustive()
}

export { describeEstimationError }
