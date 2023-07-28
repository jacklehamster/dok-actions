import { ExecutionParameters } from "../execution/ExecutionStep";
import { calculateObject } from "./calculateObjectResolution";

describe('calculateObject', () => {
    const parameters: ExecutionParameters = {x: { t: "test" }};

    it('should calculate access resolution', () => {
        expect(calculateObject({
            subject: "~{x}",
            access: ["t"],
        }).valueOf(parameters)).toEqual("test");
    });

    it('should calculate subject resolution', () => {
        expect(calculateObject({
            subject: "~{x}",
        }).valueOf(parameters)).toEqual({t: "test"});
    });

    it('should calculate resolution with formula', () => {
        expect(calculateObject({
            subject: "~{x}",
            access: [0],
            formula: "~{value + 5}"
        }).valueOf({ x: [5] })).toEqual(10);
    });
});
