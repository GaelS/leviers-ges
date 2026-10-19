import type { AppliedAssumptions } from '../../estimate/estimate-result.ts'
import type { RailShare } from './resolve-rail-share.ts'

function toRailShareAssumption(railShare: RailShare): AppliedAssumptions {
  if (!railShare.defaulted) return {}
  return {
    railShare: {
      value: railShare.fraction.toFixed(),
      source:
        'SDES, Bilan annuel des transports 2024: rail share of public transport passenger-km, 82% in Île-de-France and 24% elsewhere',
      limit:
        'One value per region group: a territory with a large metro or tram network outside Île-de-France (Lyon, Marseille, Lille) has a higher rail share, so its road public transport is overestimated. A territory straddling Île-de-France and another region, or with a commune of unknown region, takes 24%',
    },
  }
}

export { toRailShareAssumption }
