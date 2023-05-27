import * as math from "mathjs";
import { Context } from "../context/Context";
import { Expression, Formula } from "./Formula";
import { Resolution } from "./Resolution";
export declare function hasFormula(resolution: Resolution): boolean;
export declare function isFormula(value: Formula | Expression | any): boolean;
export declare function calculateEvaluator<T>(evaluator: math.EvalFunction, context: Context | undefined, formula: Formula | Expression, defaultValue: T): T;
export declare function getFormulaEvaluator(value: Formula | Expression): math.EvalFunction;
