import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it } from 'vitest'

const SOURCE_DIRECTORY = import.meta.dirname

const CONSTANT_DECLARATION = /^(?:export )?const ([A-Z][A-Z0-9_]*)\b/
const SOURCE_COMMENT = /^\/\/ Source :/

function listProductionFiles(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) return listProductionFiles(path)
    return path.endsWith('.ts') && !path.endsWith('.spec.ts') ? [path] : []
  })
}

function hasSourceComment(lines: readonly string[], declarationIndex: number): boolean {
  const commentBlock = lines
    .slice(0, declarationIndex)
    .reverse()
    .reduce<{ lines: string[]; closed: boolean }>(
      (block, line) =>
        block.closed || !line.startsWith('//')
          ? { ...block, closed: true }
          : { lines: [line, ...block.lines], closed: false },
      { lines: [], closed: false },
    ).lines
  return commentBlock.some((line) => SOURCE_COMMENT.test(line))
}

function findConstantsWithoutSource(file: string): string[] {
  const lines = readFileSync(file, 'utf8').split('\n')
  return lines.flatMap((line, index) => {
    const name = CONSTANT_DECLARATION.exec(line)?.[1]
    return name !== undefined && !hasSourceComment(lines, index) ? [`${file}: ${name}`] : []
  })
}

describe('constantes', () => {
  it('chaque constante en majuscules est précédée d’un commentaire « Source : »', () => {
    const files = listProductionFiles(SOURCE_DIRECTORY)
    expect(files.length).toBeGreaterThan(0)
    expect(files.flatMap(findConstantsWithoutSource)).toEqual([])
  })
})
