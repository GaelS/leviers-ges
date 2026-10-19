import { createHash } from 'node:crypto'
import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildTransportPersonnes } from './build-transport-personnes.ts'
import { readTransportSources } from './read-transport-sources.ts'

const dataDirectory = join(import.meta.dirname, '..', '..', '..', 'data')
const outputDirectory = join(dataDirectory, 'transport-personnes')

const transportBuild = readTransportSources(dataDirectory).andThen(buildTransportPersonnes)

if (transportBuild.isErr()) {
  console.error(JSON.stringify(transportBuild.error))
  process.exitCode = 1
} else {
  const { regions, departements, epcis } = transportBuild.value
  const outputs = [
    { file: 'regions.csv', build: regions },
    { file: 'departements.csv', build: departements },
    { file: 'epcis.csv', build: epcis },
  ]
  outputs.forEach(({ file, build }) => {
    writeFileSync(join(outputDirectory, file), build.csv)
    const checksum = createHash('sha256').update(build.csv).digest('hex')
    console.log(
      JSON.stringify({
        file,
        checksum,
        territoryCount: build.territoryCount,
        controlTotals: build.controlTotals,
      }),
    )
  })
}
