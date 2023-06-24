import { calculateTypedArray } from "./calculateTypeArray";

describe('calculateTypedArray', () => {
    it('should calculate typedarray resolution', () => {
        expect(calculateTypedArray("~{x}").valueOf({x: new Float32Array([1, 2, 3])})).toEqual(new Float32Array([1, 2, 3]));
    })

    it('should calculate typedarray resolution when passed an array', () => {
        expect(calculateTypedArray("~{x}").valueOf({x: [1, 2, 3]})).toEqual(new Float32Array([1, 2, 3]));
    })
});
