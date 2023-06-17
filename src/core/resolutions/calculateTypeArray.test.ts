import { Context, createContext } from "../context/Context";
import { calculateTypedArray } from "./calculateTypeArray";

describe('calculateTypedArray', () => {
    it('should calculate typedarray resolution', () => {
        const context: Context = createContext({
            parameters: [{x: new Float32Array([1, 2, 3])}],
        });    
        expect(calculateTypedArray("~{x}").valueOf(context)).toEqual(new Float32Array([1, 2, 3]));
    })

    it('should calculate typedarray resolution when passed an array', () => {
        const context: Context = createContext({
            parameters: [{x: [1, 2, 3]}],
        });    
        expect(calculateTypedArray("~{x}").valueOf(context)).toEqual(new Float32Array([1, 2, 3]));
    })
});
