import type { Tonnes } from '../../../domain/units.ts'

type NitrogenCampaigns = 'two-year-average' | 'single-campaign'

type NitrogenDelivered = {
  readonly tonnes: Tonnes
  readonly campaigns: NitrogenCampaigns
}

export type { NitrogenCampaigns, NitrogenDelivered }
