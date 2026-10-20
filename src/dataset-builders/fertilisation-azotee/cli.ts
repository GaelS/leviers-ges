import { writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { buildNitrogenDeliveries } from './build-nitrogen-deliveries.ts'
import { readNitrogenSources } from './read-nitrogen-sources.ts'

const dataDirectory = join(import.meta.dirname, '..', '..', '..', 'data')

const deliveriesBuild = readNitrogenSources(dataDirectory).andThen(buildNitrogenDeliveries)

if (deliveriesBuild.isErr()) {
  console.error(JSON.stringify(deliveriesBuild.error))
  process.exitCode = 1
} else {
  const { regions, departements } = deliveriesBuild.value
  writeFileSync(join(dataDirectory, 'fertilisation-azotee', 'regions.csv'), regions.csv)
  writeFileSync(join(dataDirectory, 'fertilisation-azotee', 'departements.csv'), departements.csv)
  console.log(
    JSON.stringify({
      regions: regions.regionCount,
      departements: departements.departementCount,
      regionTonnes: [regions.firstCampaignTonnes, regions.secondCampaignTonnes],
      departementTonnes: departements.tonnes,
    }),
  )
}
