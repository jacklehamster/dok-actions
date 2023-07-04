import { ExecutionStep, execute } from "../../execution/ExecutionStep";
import { convertDefaultValuesProperty, convertSetProperty, convertSetsProperty } from "./convert-set";

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

    it('convert sets', async () => {
        const results: ExecutionStep[] = [];
        await convertSetsProperty({
                sets: {
                    a: "~{b}",
                    b: "~{a}",
                    c: "~{value * 10}",
                },
            },
            results,
        );
        const parameters: Record<string, any> = {
            a: 123,
            b: 456,
            c: 789,
        };
        execute(results, parameters);
        expect(parameters).toEqual({a: 456, b: 123, c: 7890});
    });

    it('convert defaultValues', async () => {
        const results: ExecutionStep[] = [];
        await convertDefaultValuesProperty({
                defaultValues: {
                    a: 333,
                    b: 333,
                },
            },
            results,
        );
        const parameters: Record<string, any> = {
            a: 123,
        };
        execute(results, parameters);
        expect(parameters).toEqual({a: 123, b: 333});
    });
});
