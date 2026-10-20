import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'
import { LEVERS } from '../domain/lever-registry.ts'

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

describe('docs/methodology/points-a-arbitrer.md', () => {
  it('ne contient que des dossiers de levier connus du registre', () => {
    const unknown = implementedLeverIds.filter((id) => !(id in LEVERS))
    expect(unknown).toEqual([])
  })

  it('nomme chaque levier implémenté par son identifiant complet', () => {
    const missing = implementedLeverIds.filter((id) => !register.includes(`\`${id}\``))
    expect(missing).toEqual([])
  })
})
