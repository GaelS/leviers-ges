import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { LEVERS } from '../domain/lever-registry.ts'
import type { Level } from '../domain/territory.ts'

const repositoryRoot = join(import.meta.dirname, '..', '..')

const implementedLeverIds = readdirSync(join(repositoryRoot, 'src', 'levers'), {
  withFileTypes: true,
})
  .filter((entry) => entry.isDirectory())
  .map(({ name }) => name.replaceAll('-', '_'))

const register = readFileSync(
  join(repositoryRoot, 'docs', 'methodology', 'points-a-arbitrer.md'),
  'utf8',
)

const UNCOMPUTED_SECTION_TITLE = '## Niveaux non calculés'

const levelLabels: Readonly<Record<Level, string>> = {
  region: 'région',
  departement: 'département',
  epci: 'EPCI',
}

const uncomputedSection = register
  .split('\n## ')
  .find((section) => `## ${section}`.startsWith(UNCOMPUTED_SECTION_TITLE))

const uncomputedRows = (uncomputedSection ?? '')
  .split('\n')
  .filter((line) => line.startsWith('|'))
  .map((line) => line.split('|').map((cell) => cell.trim()))

const uncomputedCells = Object.entries(LEVERS).flatMap(([leverId, statuses]) =>
  (Object.entries(statuses) as [Level, string][])
    .filter(([, status]) => status === 'not_computed')
    .map(([level]) => ({ leverId, level })),
)

describe('docs/methodology/points-a-arbitrer.md', () => {
  it('ne contient que des dossiers de levier connus du registre', () => {
    const unknown = implementedLeverIds.filter((id) => !(id in LEVERS))
    expect(unknown).toEqual([])
  })

  it('nomme chaque levier implémenté par son identifiant complet', () => {
    const missing = implementedLeverIds.filter((id) => !register.includes(`\`${id}\``))
    expect(missing).toEqual([])
  })

  it('a une section « Niveaux non calculés »', () => {
    expect(uncomputedSection).toBeDefined()
  })

  it.each(uncomputedCells)(
    'explique pourquoi $leverId n’est pas calculé au niveau $level',
    ({ leverId, level }) => {
      const explained = uncomputedRows.some(
        ([, lever, levels, reason]) =>
          lever === `\`${leverId}\`` &&
          (levels ?? '').split(',').map((label) => label.trim()).includes(levelLabels[level]) &&
          (reason ?? '').length > 0,
      )
      expect(explained).toBe(true)
    },
  )
})
