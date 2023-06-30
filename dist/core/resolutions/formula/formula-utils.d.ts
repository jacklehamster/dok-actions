import { Resolution } from "../Resolution";
import { Expression, Formula } from "./Formula";
export declare function hasFormula(resolution: Resolution): boolean;
export declare function isFormula(value: Formula | Expression | any): boolean;
interface FormulaChunk {
    formula: Formula;
    textSuffix: string;
}
export declare function getInnerFormulas(value: Formula | Expression | any): FormulaChunk[];
export declare function isSimpleInnerFormula(innerFormula: string): boolean;
export {};
