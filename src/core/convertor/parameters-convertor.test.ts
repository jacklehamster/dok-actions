import { ScriptAction } from "../actions/ScriptAction";
import { createContext } from "../context/Context";
import { ExecutionStep, execute } from "../execution/ExecutionStep";
import { getDefaultConvertors } from "./default-convertors";
import { DEFAULT_EXTERNALS } from "./default-externals";
import { convertHooksProperty, convertParametersProperty } from "./parameters-convertor";

describe('parameters convertor', () => {
    const mock = jest.fn();
    const scriptExecution: ExecutionStep = (parameters) => {
        mock(JSON.parse(JSON.stringify(parameters)));
    };
    const getSteps = jest.fn().mockReturnValue([scriptExecution]);
    const getRemainingActions = jest.fn().mockReturnValue([]);
    const refreshSteps = jest.fn();
    const stopRefresh = jest.fn();

    it('convert parameters', async () => {
        const results: ExecutionStep[] = [];
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

    it('convert parameters with defaults', async () => {
        const results: ExecutionStep[] = [];
        await convertParametersProperty({
                executeScript: "script",
                defaultParameters: {
                    param1: 100,
                    param2: 102,
                    param3: "test",
                },
                parameters: {
                    "param3": "test2",
                },
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            DEFAULT_EXTERNALS,
            getDefaultConvertors(),
        );
        execute(results, {param2: 0});
        expect(mock).toBeCalledWith({
            param1: 100,
            param2: 0,
            param3: "test2",
        });
    });

    it('convert array parameters', async () => {
        const results: ExecutionStep[] = [];
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

    it('convert hooks', async () => {
        const context = createContext();
        const fun = jest.fn().mockReturnValue(69);
        const results: ExecutionStep[] = [];
        await convertHooksProperty<ScriptAction>({
                hooks: ["fun"],
                executeScript: "script",
                parameters: {
                    "test": "~{fun()}",
                }
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            {...DEFAULT_EXTERNALS, fun},
            getDefaultConvertors(),
        );
        execute(results, {}, context);
        expect(mock).toBeCalledWith({
            test: 69,
        });
    });
});
