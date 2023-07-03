import { ExecutionStep, execute } from "../execution/ExecutionStep";
import { convertExternalCallProperty } from "./convert-external-call";

describe('external convertor', () => {
    const fun = jest.fn();
    const getSteps = jest.fn().mockReturnValue([]);
    const getRemainingActions = jest.fn().mockReturnValue([]);
    const refreshSteps = jest.fn();
    const stopRefresh = jest.fn();
    it('convert external call', async () => {
        const results: ExecutionStep[] = [];
        await convertExternalCallProperty({
                callExternal: {
                    name: "fun",
                    arguments: "fun-test",
                },
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            { fun },
        );
        execute(results);
        expect(fun).toBeCalledWith("fun-test");
    });
});
