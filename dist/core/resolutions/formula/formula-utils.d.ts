import { Resolution } from "../Resolution";
import { Formula } from "./Formula";
export declare function hasFormula(resolution: Resolution): boolean;
export declare function isFormula(value: Formula | any): boolean;
interface FormulaChunk {
    formula: Formula;
    textSuffix: string;
}
export declare function getInnerFormulas(formula: Formula): FormulaChunk[];
export declare function isSimpleInnerFormula(innerFormula: string): boolean;
export {};
