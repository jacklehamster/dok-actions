import { ExecutionParameters } from "../execution/ExecutionStep";
import { calculateString } from "./calculateString";

describe('calculateString', () => {
    const parameters: ExecutionParameters = {x: "test"};

    it('should calculate number resolution', () => {
        expect(calculateString("test").valueOf(parameters)).toEqual("test");
        expect(calculateString("~{concat(\"test\", \"ing\")}").valueOf(parameters)).toEqual("testing");
        expect(calculateString("~{x}").valueOf(parameters)).toEqual("test");
    })
});
