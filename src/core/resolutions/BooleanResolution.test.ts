import { Context } from "../context/Context";
import { calculateBoolean } from "./BooleanResolution";
import { calculateNumber } from "./NumberResolution";

describe('calculateBoolean', () => {
    const context: Context = {
        time: 123,
        parameters: [{x: 10}],
    };

    it('should calculate boolean resolution', () => {
        expect(calculateBoolean(true).valueOf(context)).toEqual(true);
        expect(calculateNumber("{5 == 1}").valueOf(context)).toEqual(false);
        expect(calculateNumber("{10 == x}").valueOf(context)).toEqual(true);
    })
});
