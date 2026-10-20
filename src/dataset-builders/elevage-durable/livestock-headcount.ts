import type BigNumber from 'bignumber.js'
import { sum, toBig } from '../../domain/big-number.ts'

type LivestockCategories = ReadonlyMap<string, string>

type LivestockHeadcount = {
  readonly dairyCows: BigNumber
  readonly otherCattle: BigNumber
  readonly sows: BigNumber
  readonly otherPigs: BigNumber
  readonly goats: BigNumber
  readonly sheep: BigNumber
  readonly horses: BigNumber
  readonly mulesAndDonkeys: BigNumber
  readonly layingHens: BigNumber
  readonly broilers: BigNumber
  readonly otherPoultry: BigNumber
}

// Source : Agreste, recensement agricole 2020, cheptels : la valeur « s » marque le secret statistique
const SECRET_STATISTIC_MARK = 's'

// Source : tableur PlanET V1, DonneesTerritoires!D23 : correspondance entre les catégories de l'OMINEA et celles du recensement agricole 2020 d'Agreste, à décliner par l'utilisateur (choix de conception, non validé)
const CATEGORY_CODES = {
  cattle: '1',
  equids: '2',
  mulesAndDonkeys: '2.15',
  goats: '3',
  sheep: '4',
  pigs: '5',
  sows: '5.11',
  poultry: '7',
  hensAndPullets: '7.11',
  layingHensForConsumption: '7.11.1',
  layingHensForHatching: '7.11.2',
  pullets: '7.11.3',
  broilers: '7.11.4',
} as const

// Source : élément neutre de l'addition : une catégorie sous secret statistique ou absente compte pour zéro (choix de conception, non validé)
const NO_HEADS: BigNumber = toBig('0')

function headsOf(categories: LivestockCategories, code: string): BigNumber {
  const text = categories.get(code)
  if (text === undefined || text === SECRET_STATISTIC_MARK) return NO_HEADS
  return toBig(text)
}

function nonNegative(heads: BigNumber): BigNumber {
  return heads.isNegative() ? NO_HEADS : heads
}

function listSecretCategories(categories: LivestockCategories): readonly string[] {
  return Object.values(CATEGORY_CODES).filter((code) => categories.get(code) === SECRET_STATISTIC_MARK)
}

function toLivestockHeadcount({
  categories,
  dairyCows,
}: {
  categories: LivestockCategories
  dairyCows: BigNumber
}): LivestockHeadcount {
  const heads = (code: string) => headsOf(categories, code)
  return {
    dairyCows,
    otherCattle: nonNegative(heads(CATEGORY_CODES.cattle).minus(dairyCows)),
    sows: heads(CATEGORY_CODES.sows),
    otherPigs: nonNegative(heads(CATEGORY_CODES.pigs).minus(heads(CATEGORY_CODES.sows))),
    goats: heads(CATEGORY_CODES.goats),
    sheep: heads(CATEGORY_CODES.sheep),
    horses: nonNegative(heads(CATEGORY_CODES.equids).minus(heads(CATEGORY_CODES.mulesAndDonkeys))),
    mulesAndDonkeys: heads(CATEGORY_CODES.mulesAndDonkeys),
    layingHens: sum([
      heads(CATEGORY_CODES.layingHensForConsumption),
      heads(CATEGORY_CODES.layingHensForHatching),
      heads(CATEGORY_CODES.pullets),
    ]),
    broilers: heads(CATEGORY_CODES.broilers),
    otherPoultry: nonNegative(
      heads(CATEGORY_CODES.poultry).minus(heads(CATEGORY_CODES.hensAndPullets)),
    ),
  }
}

export { listSecretCategories, SECRET_STATISTIC_MARK, toLivestockHeadcount }
export type { LivestockCategories, LivestockHeadcount }
