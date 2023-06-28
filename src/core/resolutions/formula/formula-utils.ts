import { Resolution } from "../Resolution";
import { Expression, FORMULA_SEPERATORS, Formula } from "./Formula";

export function hasFormula(resolution: Resolution): boolean {
    if (isFormula(resolution)) {
        return true;
    }
    if (Array.isArray(resolution)) {
        return resolution.some(item => hasFormula(item));
    }
    if (resolution && typeof (resolution) === "object") {
        return hasFormula(Object.values(resolution)) || hasFormula(Object.keys(resolution));
    }
    return false;
}

export function isFormula(value: Formula | Expression | any) {
    if (!value) {
        return false;
    }
    if (typeof(value) !== "string" && typeof(value) !== "object") {
        return false;
    }
    const formula = typeof(value) === "string" ? value : value.formula;
    const [prefix, suffix] = FORMULA_SEPERATORS;
    return formula?.indexOf(prefix) === 0 && formula?.indexOf(suffix) === formula.length - suffix.length;
}

export function getInnerFormula(value: Formula | Expression | any) {
    const formula = typeof(value) === "string" ? value : value.formula;
    const [prefix, suffix] = FORMULA_SEPERATORS;
    const innerFormula = formula.substring(prefix.length, formula.length - suffix.length);
    return innerFormula;
}

const IDENTIFIER_REGEX = /^([^\x00-\x7F]|[A-Za-z_])([^\x00-\x7F]|\w)+$/;

export function isSimpleInnerFormula(innerFormula: string) {
    return IDENTIFIER_REGEX.test(innerFormula);
}

