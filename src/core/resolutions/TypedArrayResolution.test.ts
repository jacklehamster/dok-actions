import { Context } from "../context/Context";
import { calculateTypedArray } from "./TypedArrayResolution";

describe('calculateTypedArray', () => {
    const context: Context = {
        time: 123,
        parameters: [{x: new Float32Array([1, 2, 3])}],
    };

    it('should calculate typedarray resolution', () => {
        expect(calculateTypedArray("{x}").valueOf(context)).toEqual(new Float32Array([1, 2, 3]));
    })
});
