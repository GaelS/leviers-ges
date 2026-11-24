import type { HeatNetwork } from '../../domain/heat-network.ts';
import type { Fraction, TonnesCo2ePerYear } from '../../domain/units.ts';
declare function calculateReseauxChaleurReduction({ reductionFraction, networks, }: {
    reductionFraction: Fraction;
    networks: readonly HeatNetwork[];
}): TonnesCo2ePerYear;
export { calculateReseauxChaleurReduction };
