import * as math from "mathjs";
import { Expression, Formula } from "./Formula";
export declare function calculateEvaluator<T>(evaluator: math.EvalFunction, parameters: Record<string, import("../SupportedTypes").SupportedTypes> | undefined, formula: Formula | Expression, defaultValue: T): T;
export declare function getFormulaEvaluator(value: Formula | Expression): math.EvalFunction;
