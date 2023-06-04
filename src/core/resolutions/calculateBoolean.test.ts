import { Context, createContext } from "../context/Context";
import { calculateBoolean } from "./calculateBoolean";

describe('calculateBoolean', () => {
    const context: Context = createContext({
        parameters: [{x: 10}],
    });

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
