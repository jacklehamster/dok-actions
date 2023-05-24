import { Context } from "../context/Context";
import { calculateNumber } from "./NumberResolution";

describe('calculateNumber', () => {
    const context: Context = {
        time: 123,
        parameters: [{x: 10}],
    };

    it('should calculate number resolution', () => {
        expect(calculateNumber(5).valueOf(context)).toEqual(5);
        expect(calculateNumber("{5 + 1}").valueOf(context)).toEqual(6);
        expect(calculateNumber("{5 + x}").valueOf(context)).toEqual(15);
    })
});
