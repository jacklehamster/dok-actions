import { Context, createContext } from "../context/Context";
import { calculateString } from "./calculateString";

describe('calculateString', () => {
    const context: Context = createContext({
        parameters: [{x: "test"}],
    });

    it('should calculate number resolution', () => {
        expect(calculateString("test").valueOf(context)).toEqual("test");
        expect(calculateString("~{concat(\"test\", \"ing\")}").valueOf(context)).toEqual("testing");
        expect(calculateString("~{x}").valueOf(context)).toEqual("test");
    })
});
