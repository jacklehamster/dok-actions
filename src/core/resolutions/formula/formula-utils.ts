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
    const [startCharacter, prefix, suffix] = FORMULA_SEPERATORS.map(char => formula?.indexOf(char));
    return startCharacter === 0 && prefix > startCharacter && suffix > prefix;
}

interface FormulaChunk {
    formula: Formula;
    textSuffix: string;
}

export function getInnerFormulas(value: Formula | Expression | any): FormulaChunk[] {
    const formula: string = typeof(value) === "string" ? value : value.formula;
    const [startCharacter, prefix, suffix] = FORMULA_SEPERATORS;

    //  parse formulas out. Formulas have format like this: ~{formula}text{formula}.
    return formula.substring(startCharacter.length).split(prefix).map((chunk, index) => {
        if (index === 0) {
            return { textSuffix: chunk, formula: "" };
        }
        const [formula, textSuffix] = chunk.split(suffix);
        return { formula, textSuffix };
    }).filter(({ textSuffix, formula}) => textSuffix.length || formula.length);
}

const IDENTIFIER_REGEX = /^([^\x00-\x7F]|[A-Za-z_])([^\x00-\x7F]|\w)+$/;

export function isSimpleInnerFormula(innerFormula: string) {
    return IDENTIFIER_REGEX.test(innerFormula);
}

