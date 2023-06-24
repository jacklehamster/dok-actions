import { calculateMap } from "./calculateMap";

describe('calculateMap', () => {
    const parameters = {x: {a: 123, b: "test"}};

    it('should calculate map resolution', () => {
        expect(calculateMap({a: 123}).valueOf(parameters)).toEqual({a: 123});
        expect(calculateMap("~{x}").valueOf(parameters)).toEqual({a: 123, b: "test"});
    });

    it('should calculate map of resolution', () => {
        expect(calculateMap({x: "~{x}"}).valueOf(parameters)).toEqual({x:{a: 123, b: "test"}});
    });
});
