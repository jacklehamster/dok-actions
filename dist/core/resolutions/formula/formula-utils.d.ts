import { Resolution } from "../Resolution";
import { Expression, Formula } from "./Formula";
export declare function hasFormula(resolution: Resolution): boolean;
export declare function isFormula(value: Formula | Expression | any): boolean;
export declare function getInnerFormula(value: Formula | Expression | any): any;
export declare function isSimpleInnerFormula(innerFormula: string): boolean;
