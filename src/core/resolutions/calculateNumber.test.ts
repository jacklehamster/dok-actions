import { ExecutionParameters } from "../execution/ExecutionStep";
import { calculateNumber } from "./calculateNumber";

describe('calculateNumber', () => {
    const parameters: ExecutionParameters = {x: 10};

    it('should calculate number resolution', () => {
        expect(calculateNumber(5).valueOf(parameters)).toEqual(5);
        expect(calculateNumber("~{5 + 1}").valueOf(parameters)).toEqual(6);
        expect(calculateNumber("~{5 + x}").valueOf(parameters)).toEqual(15);
    })
});
