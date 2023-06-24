import { calculateResolution } from "./calculate";

describe('calculate', () => {
    describe('calculateResolution', () => {
        it('should calculate Number resolution', () => {
            const value = calculateResolution("~{5 + 1}");
            expect(value!.valueOf()).toEqual(6);
        });

        it('should calculate Number resolution with context', () => {
            const value = calculateResolution("~{5 + x}");
            expect(value!.valueOf({x: 30})).toEqual(35);
        });

        it('should calculate String resolution', () => {
            const value = calculateResolution("~{x}");
            expect(value!.valueOf({x: "testing"})).toEqual("testing");            
        });

        it('should calculate TypedArray resolution', () => {
            const value = calculateResolution("~{x}");
            expect(value!.valueOf({x: new Float32Array([1, 2, 3])})).toEqual(new Float32Array([1, 2, 3]));            
        });

        it('should calculate array resolution', () => {
            const value = calculateResolution("~{x}");
            expect(value!.valueOf({x: [1, 2, 3]})).toEqual([1, 2, 3]);
        });
        

        it('should calculate object resolution', () => {
            const value = calculateResolution("~{x}");
            expect(value!.valueOf({x: {a: 123}})).toEqual({a: 123});
        });
    });
})