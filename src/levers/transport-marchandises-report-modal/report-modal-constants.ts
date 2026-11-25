import { ELECTRICITY_EMISSION_FACTOR_SHARE } from '../../domain/emission-factors.ts'
import { quantity } from '../../domain/units.ts'
import type { Fraction, KgCo2ePerTonneKilometre, TonneKilometres } from '../../domain/units.ts'

// Source : TrsptMarch_ReportModal, formes de la formule et B13 : « Les facteurs 0,8064, 1,0164, … sont issus de l'analyse du programme CEE REMOVE » ; part des t.km routières évitées par t.km reportée vers le ferroviaire, introuvable dans les documents REMOVE lus
const RAIL_SHIFT_AVOIDED_ROAD_RATIO: Fraction = quantity<'Fraction'>('0.8064')

// Source : TrsptMarch_ReportModal, formes de la formule et B13 : t.km ferroviaires créées par t.km reportée vers le ferroviaire (augmentation de distance), introuvable dans les documents REMOVE lus
const RAIL_SHIFT_ADDED_RAIL_RATIO: Fraction = quantity<'Fraction'>('1.0164')

// Source : TrsptMarch_ReportModal, formes de la formule et B13 : part des t.km routières évitées par t.km reportée vers le fluvial, introuvable dans les documents REMOVE lus
const WATERWAY_SHIFT_AVOIDED_ROAD_RATIO: Fraction = quantity<'Fraction'>('0.8176')

// Source : TrsptMarch_ReportModal, formes de la formule et B13 : t.km fluviales créées par t.km reportée vers le fluvial, introuvable dans les documents REMOVE lus
const WATERWAY_SHIFT_ADDED_WATERWAY_RATIO: Fraction = quantity<'Fraction'>('0.9576')

// Source : Base Empreinte de l'ADEME, élément 47691 « Train, motorisation moyenne, chargement moyen », France continentale : combustion 0,004715 + amont 0,002563 = 0,007278, fabrication (0,002991) exclue ; DonneesReference!D42 « avec prise en compte d'une part de l'amont »
// Source : Base Empreinte, élément 47691 (« Train, motorisation moyenne, chargement moyen », France continentale) : combustion 0,004715 kgCO2e/t.km
const RAIL_FREIGHT_COMBUSTION_EMISSION_FACTOR: KgCo2ePerTonneKilometre =
  quantity<'KgCo2ePerTonneKilometre'>('0.004715')

// Source : Base Empreinte, élément 47691 (même ligne) : amont 0,002563 kgCO2e/t.km, fabrication exclue (PlanET V1, DonneesReference!D42 : « avec prise en compte d'une part de l'amont »)
const RAIL_FREIGHT_UPSTREAM_EMISSION_FACTOR: KgCo2ePerTonneKilometre =
  quantity<'KgCo2ePerTonneKilometre'>('0.002563')

// Source : documentation fonctionnelle PlanET (juin 2026), 7.3.8.4, p. 65 : l'amont est compté à 67,4 % : 0,002563 × 67,4 % = 0,001727462 kgCO2e/t.km
const RAIL_FREIGHT_APPLIED_UPSTREAM_EMISSION_FACTOR: KgCo2ePerTonneKilometre =
  quantity<'KgCo2ePerTonneKilometre'>(
    RAIL_FREIGHT_UPSTREAM_EMISSION_FACTOR.times(ELECTRICITY_EMISSION_FACTOR_SHARE).toFixed(),
  )

// Source : documentation fonctionnelle PlanET (juin 2026), 7.3.8.4, p. 65 : facteur du ferroviaire « Amont × 67,4 % et combustion » : 0,004715 + 0,001727462 = 0,006442462 kgCO2e/t.km
const RAIL_FREIGHT_EMISSION_FACTOR: KgCo2ePerTonneKilometre = quantity<'KgCo2ePerTonneKilometre'>(
  RAIL_FREIGHT_COMBUSTION_EMISSION_FACTOR.plus(RAIL_FREIGHT_APPLIED_UPSTREAM_EMISSION_FACTOR).toFixed(),
)

// Source : PlanET V1, FE_fluvial!D25 : moyenne de six facteurs de la Base Empreinte par classe de bateau, combustion seule, pondérée par le nombre de bateaux de la flotte active VNF 2016
const WATERWAY_FREIGHT_EMISSION_FACTOR: KgCo2ePerTonneKilometre =
  quantity<'KgCo2ePerTonneKilometre'>('0.0206283')

// Source : ParametreDeterminants!A36 « Tonnes.km de TRM passées de la route à des modes actifs » : le tableur ne donne ni valeur par défaut ni valeur SNBC 3, zéro quand la requête n'en donne pas (choix de conception, non validé)
const DEFAULT_CYCLOLOGISTIC_TONNE_KILOMETRES: TonneKilometres = quantity<'TonneKilometres'>('0')

export {
  DEFAULT_CYCLOLOGISTIC_TONNE_KILOMETRES,
  RAIL_FREIGHT_EMISSION_FACTOR,
  RAIL_SHIFT_ADDED_RAIL_RATIO,
  RAIL_SHIFT_AVOIDED_ROAD_RATIO,
  WATERWAY_FREIGHT_EMISSION_FACTOR,
  WATERWAY_SHIFT_ADDED_WATERWAY_RATIO,
  WATERWAY_SHIFT_AVOIDED_ROAD_RATIO,
}
