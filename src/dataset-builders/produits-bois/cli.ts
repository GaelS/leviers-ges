import { createHash } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildWoodProduction } from './build-wood-production.ts'
import { readWoodSources } from './read-wood-sources.ts'

const dataDirectory = join(import.meta.dirname, '..', '..', '..', 'data')

const woodBuild = readWoodSources(dataDirectory).andThen(buildWoodProduction)

function checksumOf(csv: string): string {
  return createHash('sha256').update(csv).digest('hex')
}

if (woodBuild.isErr()) {
  console.error(JSON.stringify(woodBuild.error))
  process.exitCode = 1
} else {
  const { regionsCsv, departementsCsv, constantsCsv, ...summary } = woodBuild.value
  writeFileSync(join(dataDirectory, 'produits-bois', 'regions.csv'), regionsCsv)
  writeFileSync(join(dataDirectory, 'produits-bois', 'departements.csv'), departementsCsv)
  writeFileSync(join(dataDirectory, 'produits-bois', 'constants.csv'), constantsCsv)
  console.log(
    JSON.stringify({
      checksums: {
        'regions.csv': checksumOf(regionsCsv),
        'departements.csv': checksumOf(departementsCsv),
        'constants.csv': checksumOf(constantsCsv),
      },
      ...summary,
    }),
  )
}
