import { createHash } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildOccupationData } from './build-occupation-data.ts'
import { readOccupationSources } from './read-occupation-sources.ts'

const dataDirectory = join(import.meta.dirname, '..', '..', '..', 'data')

const occupationBuild = readOccupationSources(dataDirectory).andThen(buildOccupationData)

function checksumOf(csv: string): string {
  return createHash('sha256').update(csv).digest('hex')
}

if (occupationBuild.isErr()) {
  console.error(JSON.stringify(occupationBuild.error))
  process.exitCode = 1
} else {
  const { surfacesCsv, factorsCsv, ...summary } = occupationBuild.value
  writeFileSync(join(dataDirectory, 'occupation-des-sols', 'epcis-surfaces.csv'), surfacesCsv)
  writeFileSync(join(dataDirectory, 'occupation-des-sols', 'epcis-facteurs.csv'), factorsCsv)
  console.log(
    JSON.stringify({
      checksums: {
        'epcis-surfaces.csv': checksumOf(surfacesCsv),
        'epcis-facteurs.csv': checksumOf(factorsCsv),
      },
      ...summary,
    }),
  )
}
