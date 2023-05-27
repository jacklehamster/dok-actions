import { Context } from "../context/Context";
import { calculateArray } from "./calculateArray";

describe('calculateArray', () => {
    const context: Context = {
        parameters: [{x: 10, y: "test"}],
    };

    it('should calculate array resolution', () => {
        expect(calculateArray([5,"{5 + 1}","{5 + x}","test","{y}"]).valueOf(context)).toEqual([5,6,15,"test","test"]);
    });

    it('should calculate nested array resolution', () => {
        expect(calculateArray([5,["{5 + 1}","{5 + x}"]]).valueOf(context)).toEqual([5,new Float32Array([6,15])]);
    });
});
