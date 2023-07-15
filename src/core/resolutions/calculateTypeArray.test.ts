import { calculateTypeArrayConstructor, calculateTypedArray } from "./calculateTypeArray";

describe('calculateTypedArray', () => {
    it('should calculate typedarray resolution', () => {
        expect(calculateTypedArray("~{x}").valueOf({x: new Float32Array([1, 2, 3])})).toEqual(new Float32Array([1, 2, 3]));
    });

    it('should calculate typedarray resolution when passed an array', () => {
        expect(calculateTypedArray("~{x}").valueOf({x: [1, 2, 3]})).toEqual(new Float32Array([1, 2, 3]));
    });

    it('should calculate typedarray with factory', () => {
        expect(calculateTypedArray("~{x}", { valueOf: () => Int32Array }).valueOf({x: [1, 2, 3]})).toEqual(new Int32Array([1, 2, 3]));
    });

    it('should convert type array constructor', () => {
        expect(calculateTypeArrayConstructor("INT").valueOf()).toEqual(Int32Array);
    });
});
