import * as math from "mathjs";
import { Formula } from "./Formula";
export declare function calculateEvaluator<T>(evaluator: math.EvalFunction, parameters: Record<string, import("../SupportedTypes").SupportedTypes> | undefined, formula: Formula, defaultValue: T): T;
export declare function getFormulaEvaluator(value: Formula): math.EvalFunction;
