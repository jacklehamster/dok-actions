import { ExecutionStep, execute } from "../execution/ExecutionStep";
import { convertSetProperty } from "./convert-set";

describe('set convertor', () => {
    it('convert set', async () => {
        const results: ExecutionStep[] = [];
        await convertSetProperty({
                set: {variable: "a", value: 123},
            },
            results,
        );
        const parameters: Record<string, any> = {};
        execute(results, parameters);
        expect(parameters.a).toEqual(123);
    });

    it('convert set with update', async () => {
        const results: ExecutionStep[] = [];
        await convertSetProperty({
                set: {variable: "a", value: "~{value + 100}"},
            },
            results,
        );
        const parameters: Record<string, any> = {
            a: 1,
        };
        execute(results, parameters);
        expect(parameters.a).toEqual(101);
    });

    it('convert set with access', async () => {
        const results: ExecutionStep[] = [];
        await convertSetProperty({
                set: {variable: "obj", access: ["array", 1], value: 123},
            },
            results,
        );
        const parameters: Record<string, any> = {
            obj: { array: [0, 1, 2] }
        };
        execute(results, parameters);
        expect(parameters.obj.array).toEqual([0, 123, 2]);
    });
});
