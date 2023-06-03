import { Context } from "../context/Context";
import { calculateMap } from "./calculateMap";

describe('calculateMap', () => {
    const context: Context = {
        parameters: [{x: {a: 123, b: "test"}}],
    };

    it('should calculate map resolution', () => {
        expect(calculateMap({a: 123}).valueOf(context)).toEqual({a: 123});
        expect(calculateMap("{x}").valueOf(context)).toEqual({a: 123, b: "test"});
    });

    it('should calculate map of resolution', () => {
        expect(calculateMap({x: "{x}"}).valueOf(context)).toEqual({x:{a: 123, b: "test"}});
    });
});
