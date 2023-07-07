import { ExecutionStep, execute } from "../../execution/ExecutionStep";
import { convertExternalCallProperty } from "./convert-external-call";
import { convertHooksProperty } from "./hooks-convertor";

describe('external convertor', () => {
    const fun = jest.fn();
    const getSteps = jest.fn().mockReturnValue([]);
    const getRemainingActions = jest.fn().mockReturnValue([]);
    const refreshSteps = jest.fn();
    const stopRefresh = jest.fn();
    it('convert external call', async () => {
        const results: ExecutionStep[] = [];
        await convertHooksProperty({
                hooks: ["fun"],
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            { fun },
        );
        await convertExternalCallProperty({
                callExternal: {
                    method: "~{fun}",
                    arguments: "fun-test",
                },
            },
            results);
        execute(results);
        expect(fun).toBeCalledWith("fun-test");
    });
});
