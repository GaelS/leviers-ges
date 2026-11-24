import { groupBy } from 'es-toolkit';
import { Result, err, ok } from 'neverthrow';
import { invalidDataset, } from "../../../domain/data-source.js";
import { sum } from "../../../domain/big-number.js";
import { quantity } from "../../../domain/units.js";
import { requireColumn, requireOptionalQuantityColumn, requireQuantityColumn, } from "../../require-column.js";
const treatmentFlowsDataset = 'dechets/treatment-flows';
const emissionFactorsDataset = 'dechets/emission-factors';
function toTreatmentMode(value) {
    if (value === 'storage' || value === 'incineration')
        return ok(value);
    return err(invalidDataset({
        dataset: treatmentFlowsDataset,
        reason: 'unreadable',
        detail: `treatment_mode=${value} is neither storage nor incineration`,
    }));
}
function toTreatmentFlow(row) {
    const dataset = treatmentFlowsDataset;
    return Result.combine([
        requireColumn({ dataset, row, column: 'waste_code' }),
        requireColumn({ dataset, row, column: 'treatment_mode' }).andThen(toTreatmentMode),
        requireQuantityColumn({ dataset, row, column: 'tonnes_per_year' }),
    ]).map(([wasteCode, treatmentMode, tonnes]) => ({ wasteCode, treatmentMode, tonnes }));
}
function readTreatmentFlows({ dataSource, communes, }) {
    const dataset = treatmentFlowsDataset;
    return dataSource
        .rows(dataset)
        .andThen((rows) => Result.combine(rows.map((row) => requireColumn({ dataset, row, column: 'commune_code' }).map((commune) => ({ row, commune })))))
        .andThen((flowsWithCommune) => Result.combine(flowsWithCommune.filter(({ commune }) => communes.has(commune)).map(({ row }) => toTreatmentFlow(row))));
}
function toEmissionFactors(row) {
    const dataset = emissionFactorsDataset;
    return Result.combine([
        requireColumn({ dataset, row, column: 'waste_code' }),
        requireOptionalQuantityColumn({
            dataset,
            row,
            column: 'storage_emission_factor_kg_per_tonne',
        }),
        requireOptionalQuantityColumn({
            dataset,
            row,
            column: 'incineration_emission_factor_kg_per_tonne',
        }),
    ]).map(([wasteCode, storage, incineration]) => [wasteCode, { storage, incineration }]);
}
function readEmissionFactors(dataSource) {
    return dataSource
        .rows(emissionFactorsDataset)
        .andThen((rows) => Result.combine(rows.map(toEmissionFactors)))
        .map((factorsByWasteCode) => new Map(factorsByWasteCode));
}
function tonnesOf({ flows, treatmentMode, }) {
    const sameMode = flows.filter((flow) => flow.treatmentMode === treatmentMode);
    return quantity(sum(sameMode.map(({ tonnes }) => tonnes)).toFixed());
}
function toWasteTypeTreatment({ wasteCode, flows, emissionFactors, }) {
    const wasteFactors = emissionFactors.get(wasteCode);
    return {
        wasteCode,
        storageTonnes: tonnesOf({ flows, treatmentMode: 'storage' }),
        incinerationTonnes: tonnesOf({ flows, treatmentMode: 'incineration' }),
        storageEmissionFactor: wasteFactors?.storage,
        incinerationEmissionFactor: wasteFactors?.incineration,
    };
}
function readWasteTreatment({ dataSource, communes, }) {
    return Result.combine([
        readTreatmentFlows({ dataSource, communes: new Set(communes) }),
        readEmissionFactors(dataSource),
    ]).map(([flows, emissionFactors]) => Object.entries(groupBy(flows, ({ wasteCode }) => wasteCode)).map(([wasteCode, sameType]) => toWasteTypeTreatment({ wasteCode, flows: sameType, emissionFactors })));
}
export { readWasteTreatment };
//# sourceMappingURL=read-waste-treatment.js.map