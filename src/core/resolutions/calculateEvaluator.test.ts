import { createContext } from "../context/Context";
import { calculateEvaluator, getFormulaEvaluator } from "./formula/formula-evaluator";

describe('calculateEvaluator', () => {
    it('should calculate evaluator', () => {
        const formula = "~{3 + 10}";
        const evaluator = getFormulaEvaluator(formula);
        expect(calculateEvaluator(evaluator, undefined, formula, 0)).toEqual(13);
    });

    it('should calculate evaluator with scope', () => {
        const formula = "~{3 + x}";
        const evaluator = getFormulaEvaluator(formula);
        expect(calculateEvaluator(evaluator, createContext({
            parameters: [{x: 6}],
        }), formula, 0)).toEqual(9);
    });
});

describe('getFormulaEvaluator', () => {
    it('should properly get evaluator with formula', () => {
        const evaluator = getFormulaEvaluator("~{3 + 10}");
        expect(evaluator.evaluate()).toEqual(13);
    });

    it('should properly get evaluator with expression', () => {
        const evaluator = getFormulaEvaluator({ formula: "~{3 + x}" });
        expect(evaluator.evaluate({x: 4})).toEqual(7);
    });    
});
