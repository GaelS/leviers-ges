import type { Fraction, SquareMetres } from '../../../domain/units.ts'

type HousingSurface = {
  readonly total: SquareMetres
  readonly eligibleShare: Fraction
}

export type { HousingSurface }
