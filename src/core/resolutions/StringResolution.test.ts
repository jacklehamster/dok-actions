import { Context } from "../context/Context";
import { calculateString } from "./StringResolution";

describe('calculateString', () => {
    const context: Context = {
        time: 123,
        parameters: [{x: "test"}],
    };

    it('should calculate number resolution', () => {
        expect(calculateString("test").valueOf(context)).toEqual("test");
        expect(calculateString("{concat(\"test\", \"ing\")}").valueOf(context)).toEqual("testing");
        expect(calculateString("{x}").valueOf(context)).toEqual("test");
    })
});
