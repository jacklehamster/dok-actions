import { calculateBoolean } from "./calculateBoolean";

describe('calculateBoolean', () => {
    const parameters = {x: 10};

    it('should calculate boolean resolution', () => {
        expect(calculateBoolean(true).valueOf(parameters)).toEqual(true);
        expect(calculateBoolean("~{5 == 1}").valueOf(parameters)).toEqual(false);
        expect(calculateBoolean("~{10 == x}").valueOf(parameters)).toEqual(true);
    });

    it('should resolve numbers', () => {
        expect(calculateBoolean("~{1 + 1}").valueOf(parameters)).toEqual(true);
        expect(calculateBoolean("~{1 - 1}").valueOf(parameters)).toEqual(false);
    });

    it('should resolve subjects', () => {
        expect(calculateBoolean({subject: {a: true}, access: ["a"]}).valueOf(parameters)).toEqual(true);
    });
});
