import { Context } from "../context/Context";
import { calculateResolution } from "./calculate";

describe('calculate', () => {
    describe('calculateResolution', () => {
        it('should calculate Number resolution', () => {
            const value = calculateResolution("{5 + 1}");
            expect(value!.valueOf()).toEqual(6);
        });

        it('should calculate Number resolution with context', () => {
            const context: Context = {
                parameters: [{x: 30}],
            };
            const value = calculateResolution("{5 + x}");
            expect(value!.valueOf(context)).toEqual(35);
        });

        it('should calculate String resolution', () => {
            const context: Context = {
                parameters: [{x: "testing"}],
            };
            const value = calculateResolution("{x}");
            expect(value!.valueOf(context)).toEqual("testing");            
        });

        it('should calculate TypedArray resolution', () => {
            const context: Context = {
                parameters: [{x: new Float32Array([1, 2, 3])}],
            };
            const value = calculateResolution("{x}");
            expect(value!.valueOf(context)).toEqual(new Float32Array([1, 2, 3]));            
        });

        it('should calculate array resolution', () => {
            const context: Context = {
                parameters: [{x: [1, 2, 3]}],
            };
            const value = calculateResolution("{x}");
            expect(value!.valueOf(context)).toEqual([1, 2, 3]);
        });
        

        it('should calculate object resolution', () => {
            const context: Context = {
                parameters: [{x: {a: 123}}],
            };
            const value = calculateResolution("{x}");
            expect(value!.valueOf(context)).toEqual({a: 123});
        });
    });
})