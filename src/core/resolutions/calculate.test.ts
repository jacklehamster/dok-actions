import { Context } from "../context/Context";
import { calculateResolution } from "./calculate";
import { calculateEvaluator, getFormulaEvaluator } from "./calculate";

describe('calculate', () => {
    describe('getFormulaEvaluator', () => {
        it('should properly get evaluator with formula', () => {
            const evaluator = getFormulaEvaluator("{3 + 10}");
            expect(evaluator.evaluate()).toEqual(13);
        });
    
        it('should properly get evaluator with expression', () => {
            const evaluator = getFormulaEvaluator({ formula: "{3 + x}" });
            expect(evaluator.evaluate({x: 4})).toEqual(7);
        });    
    });

    describe('calculateEvaluator', () => {
        it('should calculate evaluator', () => {
            const formula = "{3 + 10}";
            const evaluator = getFormulaEvaluator(formula);
            expect(calculateEvaluator(evaluator, undefined, formula, 0)).toEqual(13);
        });

        it('should calculate evaluator with scope', () => {
            const formula = "{3 + x}";
            const evaluator = getFormulaEvaluator(formula);
            expect(calculateEvaluator(evaluator, {
                time: 0,
                parameters: [{x: 6}],
            }, formula, 0)).toEqual(9);
        });
    });

    describe('calculateResolution', () => {
        it('should calculate Number resolution', () => {
            const value = calculateResolution("{5 + 1}");
            expect(value.valueOf()).toEqual(6);
        });

        it('should calculate Number resolution with context', () => {
            const context: Context = {
                time: 123,
                parameters: [{x: 30}],
            };
            const value = calculateResolution("{5 + x}");
            expect(value.valueOf(context)).toEqual(35);
        });

        it('should calculate String resolution', () => {
            const context: Context = {
                time: 123,
                parameters: [{x: "testing"}],
            };
            const value = calculateResolution("{x}");
            expect(value.valueOf(context)).toEqual("testing");            
        });

        it('should calculate TypedArray resolution', () => {
            const context: Context = {
                time: 123,
                parameters: [{x: new Float32Array([1, 2, 3])}],
            };
            const value = calculateResolution("{x}");
            expect(value.valueOf(context)).toEqual(new Float32Array([1, 2, 3]));            

        });
    });
})