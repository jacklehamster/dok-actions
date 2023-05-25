import * as math from "mathjs";
import { Context } from "../context/Context";
import { Expression, Formula } from "./Formula";
export declare function calculateEvaluator<T>(evaluator: math.EvalFunction, context: Context | undefined, formula: Formula | Expression, defaultValue: T): T;
export declare function getFormulaEvaluator(value: Formula | Expression): math.EvalFunction;
