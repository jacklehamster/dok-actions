import { execute } from "../../execution/ExecutionStep";
import { StepScript } from "../Convertor";
import { convertExternalCallProperty } from "./convert-external-call";
import { convertHooksProperty } from "./hooks-convertor";

describe('external convertor', () => {
    const fun = jest.fn();
    const getSteps = jest.fn().mockReturnValue([]);
    const getRemainingActions = jest.fn().mockReturnValue([]);
    const refreshSteps = jest.fn();
    const stopRefresh = jest.fn();
    it('convert external call', async () => {
        const results: StepScript = new StepScript();
        await convertHooksProperty({
                hooks: ["fun"],
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            { fun },
        );
        await convertExternalCallProperty({
                callExternal: {
                    method: "fun",
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

    it('convert external call with subject', async () => {
        const subject = {
            fun,
        };
        const results: StepScript = new StepScript()
        await convertHooksProperty({
                hooks: ["subject"],
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            { subject },
        );
        await convertExternalCallProperty({
                callExternal: {
                    subject: "~{subject}",
                    method: "fun",
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
