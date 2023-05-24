import { Context } from "../context/Context";
import { calculateBoolean } from "./BooleanResolution";

describe('calculateBoolean', () => {
    const context: Context = {
        time: 123,
        parameters: [{x: 10}],
    };

    it('should calculate boolean resolution', () => {
        expect(calculateBoolean(true).valueOf(context)).toEqual(true);
        expect(calculateBoolean("{5 == 1}").valueOf(context)).toEqual(false);
        expect(calculateBoolean("{10 == x}").valueOf(context)).toEqual(true);
    });

    it('should resolve numbers', () => {
        expect(calculateBoolean("{1 + 1}").valueOf(context)).toEqual(true);
        expect(calculateBoolean("{1 - 1}").valueOf(context)).toEqual(false);
    });
});
