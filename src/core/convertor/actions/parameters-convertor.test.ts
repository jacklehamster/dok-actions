import { ExecutionStep, execute } from "../../execution/ExecutionStep";
import { StepScript } from "../Convertor";
import { getDefaultConvertors } from "../default-convertors";
import { DEFAULT_EXTERNALS } from "../default-externals";
import { convertParametersProperty } from "./parameters-convertor";

describe('parameters convertor', () => {
    const mock = jest.fn();
    const scriptExecution: ExecutionStep = (parameters) => {
        mock(JSON.parse(JSON.stringify(parameters)));
    };
    const getSteps = jest.fn().mockReturnValue(new StepScript([scriptExecution]));
    const getRemainingActions = jest.fn().mockReturnValue([]);
    const refreshSteps = jest.fn();
    const stopRefresh = jest.fn();

    it('convert parameters', async () => {
        const results: StepScript = new StepScript();
        await convertParametersProperty({
                executeScript: "script",
                parameters: {
                    "param1": 123,
                    "param2": true,
                    "param3": "test",
                    "param4": [1, 2, 3, 4],
                    "param5": "~{1 + 3}",
                },
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            DEFAULT_EXTERNALS,
            getDefaultConvertors(),
        );
        execute(results);
        expect(mock).toBeCalledWith({
            param1: 123,
            param2: true,
            param3: "test",
            param4: [1,2,3,4],
            param5: 4,
        });
    });

    it('convert parameters. Parent parameters not retained', async () => {
        const results: StepScript = new StepScript();
        await convertParametersProperty({
                executeScript: "script",
                parameters: {
                    "param1": 123,
                },
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            DEFAULT_EXTERNALS,
            getDefaultConvertors(),
        );
        execute(results, {param1: 555, param2: 666});
        expect(mock).toBeCalledWith({
            param1: 123,
        });
    });

    it('convert array parameters', async () => {
        const results: StepScript = new StepScript();
        await convertParametersProperty({
                executeScript: "script",
                parameters: {
                    "param4": [1, 2, 3, 4],
                },
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            DEFAULT_EXTERNALS,
            getDefaultConvertors(),
        );
        execute(results);
        expect(mock).toBeCalledWith({
            param4: [1,2,3,4],
        });
    });
});
