import { err, ok, type Result } from 'neverthrow'
import { z } from 'zod'
import { invalidRequest, type InvalidRequest } from '../application/estimate/estimation-error.ts'
import { batimentsMachinesAgricolesRequestSchema } from '../levers/batiments-machines-agricoles/index.ts'
import { dechetsModeDeTraitementRequestSchema } from '../levers/dechets-mode-de-traitement/index.ts'
import { dechetsSobrieteRequestSchema } from '../levers/dechets-sobriete/index.ts'
import { haiesRequestSchema } from '../levers/haies/index.ts'
import { produitsBoisRequestSchema } from '../levers/produits-bois/index.ts'
import { reseauxChaleurRequestSchema } from '../levers/reseaux-chaleur/index.ts'
import { residentielSobrieteRequestSchema } from '../levers/residentiel-sobriete/index.ts'
import { transportPersonnesElectrificationRequestSchema } from '../levers/transport-personnes-electrification/index.ts'
import { transportPersonnesReportModalRequestSchema } from '../levers/transport-personnes-report-modal/index.ts'
import { transportPersonnesSobrieteDeplacementsRequestSchema } from '../levers/transport-personnes-sobriete-deplacements/index.ts'
import { transportPersonnesEfficaciteRequestSchema } from '../levers/transport-personnes-efficacite/index.ts'

const requestSchema = z.discriminatedUnion('id', [
  batimentsMachinesAgricolesRequestSchema,
  dechetsModeDeTraitementRequestSchema,
  dechetsSobrieteRequestSchema,
  haiesRequestSchema,
  produitsBoisRequestSchema,
  reseauxChaleurRequestSchema,
  residentielSobrieteRequestSchema,
  transportPersonnesEfficaciteRequestSchema,
  transportPersonnesElectrificationRequestSchema,
  transportPersonnesReportModalRequestSchema,
  transportPersonnesSobrieteDeplacementsRequestSchema,
])

type ParsedRequest = z.output<typeof requestSchema>

function parameterOf(issue: z.core.$ZodIssue): string {
  const unrecognizedKeys = issue.code === 'unrecognized_keys' ? issue.keys : []
  const parameter = [...issue.path.map(String), ...unrecognizedKeys].join('.')
  return parameter === '' ? 'request' : parameter
}

function messageOf(issue: z.core.$ZodIssue): string {
  if (issue.code === 'invalid_type' && issue.path.length === 0) return 'expected an object'
  if (issue.code === 'invalid_union' && issue.path.join('.') === 'id') return 'unknown lever'
  return issue.message
}

function parseRequest(input: unknown): Result<ParsedRequest, InvalidRequest> {
  const parsed = requestSchema.safeParse(input)
  if (parsed.success) return ok(parsed.data)
  return err(
    invalidRequest(
      parsed.error.issues.map((issue) => ({ parameter: parameterOf(issue), message: messageOf(issue) })),
    ),
  )
}

export { parseRequest, requestSchema }
