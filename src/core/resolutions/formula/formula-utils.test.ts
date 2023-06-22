import { isFormula } from "./formula-utils";

describe('formula-utils', () => {
    it('check is formula', () => {
        expect(isFormula("~{formula}")).toBeTruthy();
        expect(isFormula("~formula")).toBeFalsy();
        expect(isFormula("{formula}")).toBeFalsy();
        expect(isFormula("~{func(value)}")).toBeTruthy();
    });
});