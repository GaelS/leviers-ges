import { type Result } from 'neverthrow';
import { z } from 'zod';
import { type InvalidRequest } from '../application/estimate/estimation-error.ts';
declare const requestSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    id: z.ZodLiteral<"batiments_machines_agricoles">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        electricityReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
        naturalGasReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
        petroleumProductsReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
        heatReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodLiteral<"dechets_mode_de_traitement">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        storageToIncinerationFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
        storageToMaterialRecoveryFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
        incinerationToMaterialRecoveryFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodLiteral<"dechets_sobriete">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        storageReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
        incinerationReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodLiteral<"elevage_durable">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        animals: z.ZodObject<{
            dairyCows: z.ZodOptional<z.ZodObject<{
                headcountReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                entericEmissionReductionFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>>;
                targetManureShares: z.ZodObject<{
                    liquid: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    solid: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    pasture: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    anaerobicDigestion: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                }, z.core.$strict>;
            }, z.core.$strict>>;
            otherCattle: z.ZodOptional<z.ZodObject<{
                headcountReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                entericEmissionReductionFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>>;
                targetManureShares: z.ZodObject<{
                    liquid: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    solid: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    pasture: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    anaerobicDigestion: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                }, z.core.$strict>;
            }, z.core.$strict>>;
            sows: z.ZodOptional<z.ZodObject<{
                headcountReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                entericEmissionReductionFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>>;
                targetManureShares: z.ZodObject<{
                    liquid: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    solid: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    pasture: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    anaerobicDigestion: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                }, z.core.$strict>;
            }, z.core.$strict>>;
            otherPigs: z.ZodOptional<z.ZodObject<{
                headcountReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                entericEmissionReductionFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>>;
                targetManureShares: z.ZodObject<{
                    liquid: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    solid: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    pasture: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    anaerobicDigestion: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                }, z.core.$strict>;
            }, z.core.$strict>>;
            goats: z.ZodOptional<z.ZodObject<{
                headcountReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                entericEmissionReductionFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>>;
                targetManureShares: z.ZodObject<{
                    liquid: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    solid: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    pasture: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    anaerobicDigestion: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                }, z.core.$strict>;
            }, z.core.$strict>>;
            sheep: z.ZodOptional<z.ZodObject<{
                headcountReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                entericEmissionReductionFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>>;
                targetManureShares: z.ZodObject<{
                    liquid: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    solid: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    pasture: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    anaerobicDigestion: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                }, z.core.$strict>;
            }, z.core.$strict>>;
            horses: z.ZodOptional<z.ZodObject<{
                headcountReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                entericEmissionReductionFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>>;
                targetManureShares: z.ZodObject<{
                    liquid: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    solid: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    pasture: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    anaerobicDigestion: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                }, z.core.$strict>;
            }, z.core.$strict>>;
            mulesAndDonkeys: z.ZodOptional<z.ZodObject<{
                headcountReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                entericEmissionReductionFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>>;
                targetManureShares: z.ZodObject<{
                    liquid: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    solid: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    pasture: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    anaerobicDigestion: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                }, z.core.$strict>;
            }, z.core.$strict>>;
            layingHens: z.ZodOptional<z.ZodObject<{
                headcountReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                entericEmissionReductionFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>>;
                targetManureShares: z.ZodObject<{
                    liquid: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    solid: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    pasture: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    anaerobicDigestion: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                }, z.core.$strict>;
            }, z.core.$strict>>;
            broilers: z.ZodOptional<z.ZodObject<{
                headcountReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                entericEmissionReductionFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>>;
                targetManureShares: z.ZodObject<{
                    liquid: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    solid: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    pasture: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    anaerobicDigestion: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                }, z.core.$strict>;
            }, z.core.$strict>>;
            otherPoultry: z.ZodOptional<z.ZodObject<{
                headcountReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                entericEmissionReductionFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>>;
                targetManureShares: z.ZodObject<{
                    liquid: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    solid: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    pasture: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                    anaerobicDigestion: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
                }, z.core.$strict>;
            }, z.core.$strict>>;
        }, z.core.$strict>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodLiteral<"fertilisation_azotee">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        nitrogenReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodLiteral<"haies">;
    parameters: z.ZodObject<{
        hedgeKmCreatedPerYear: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Quantity<"Kilometres">, string>>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodLiteral<"occupation_des_sols">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        afforestationHectaresPerYear: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Quantity<"HectaresPerYear">, string>>;
        wetlandDevelopmentHectaresPerYear: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Quantity<"HectaresPerYear">, string>>;
        desealingHectaresPerYear: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Quantity<"HectaresPerYear">, string>>;
        horizonYears: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Quantity<"Years">, string>>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodLiteral<"pratiques_stockantes">;
    parameters: z.ZodObject<{
        intermediateCropsHectares: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Quantity<"Hectares">, string>>;
        permanentVineyardGrassingHectares: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Quantity<"Hectares">, string>>;
        winterIntercropVineyardHectares: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Quantity<"Hectares">, string>>;
        agroforestryHectares: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Quantity<"Hectares">, string>>;
        temporaryGrasslandExtensionHectares: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Quantity<"Hectares">, string>>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodLiteral<"produits_bois">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        woodProductionIncrease: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Quantity<"RelativeChange">, string>>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodLiteral<"reseaux_chaleur">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        emissionFactorReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodLiteral<"residentiel_changement_systeme_chauffage">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        targetElectricityShareFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>>;
        targetNaturalGasShareFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>>;
        targetFuelOilShareFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>>;
        targetWoodShareFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>>;
        targetHeatNetworkShareFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodLiteral<"residentiel_renovation">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        renovatedParcFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodLiteral<"residentiel_sobriete">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        householdsApplyingSobrietyFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
        consumptionReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodLiteral<"transport_marchandises_efficacite">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        ecodrivingApplicationFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
        loadFactorIncrease: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Quantity<"RelativeChange">, string>>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodLiteral<"transport_marchandises_electrification">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        additionalElectrifiedFleetFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodLiteral<"transport_marchandises_report_modal">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        roadToRailFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
        roadToWaterwayFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
        cyclologisticTonneKilometres: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Quantity<"TonneKilometres">, string>>>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodLiteral<"transport_marchandises_sobriete_logistique">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        roadFreightReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodLiteral<"transport_personnes_efficacite">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        carEcodrivingApplicationFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
        busEcodrivingApplicationFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
        carPassengerIncrease: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Quantity<"RelativeChange">, string>>;
        busPassengerIncrease: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Quantity<"RelativeChange">, string>>;
        railShareFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodLiteral<"transport_personnes_electrification">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        carElectrificationFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
        busElectrificationFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
        railShareFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodLiteral<"transport_personnes_report_modal">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        carToPublicTransportFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
        carToActiveModesFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
        publicTransportToActiveModesFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
        railShareFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>>;
    }, z.core.$strict>;
}, z.core.$strict>, z.ZodObject<{
    id: z.ZodLiteral<"transport_personnes_sobriete_deplacements">;
    territory: z.ZodObject<{
        level: z.ZodEnum<{
            departement: "departement";
            epci: "epci";
            region: "region";
        }>;
        code: z.core.$ZodBranded<z.ZodString, "TerritoryCode", "out">;
    }, z.core.$strict>;
    parameters: z.ZodObject<{
        commutingDistanceReductionFraction: z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>;
        railShareFraction: z.ZodOptional<z.ZodPipe<z.ZodUnion<readonly [z.ZodString, z.ZodPipe<z.ZodNumber, z.ZodTransform<string, number>>]>, z.ZodTransform<import("../domain/units.ts").Fraction, string>>>;
    }, z.core.$strict>;
}, z.core.$strict>], "id">;
type ParsedRequest = z.output<typeof requestSchema>;
declare function parseRequest(input: unknown): Result<ParsedRequest, InvalidRequest>;
export { parseRequest, requestSchema };
export type { ParsedRequest };
