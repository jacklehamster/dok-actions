import { createContext } from "../context/Context";
import { ExecutionStep, execute } from "../execution/ExecutionStep";
import { DEFAULT_EXTERNALS } from "./Convertor";
import { DEFAULT_CONVERTORS } from "./default-convertors";
import { convertHooksProperty, convertParametersProperty } from "./parameters-convertor";

describe('parameters convertor', () => {
    const mock = jest.fn();
    const scriptExecution: ExecutionStep = (context) => {
        mock(JSON.parse(JSON.stringify(context.parameters![context.parameters!.length - 1])));
    };
    const getSteps = jest.fn().mockReturnValue([scriptExecution]);
    const getRemainingActions = jest.fn();
    it('convert parameters', () => {
        const results: ExecutionStep[] = [];
        convertParametersProperty({
                script: "script",
                parameters: {
                    "param1": 123,
                    "param2": true,
                    "param3": "test",
                    "param4": [1, 2, 3, 4],
                    "param5": "{1 + 3}",
                },
            },
            results,
            {getSteps, getRemainingActions},
            DEFAULT_EXTERNALS,
            DEFAULT_CONVERTORS,
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

    it('convert array parameters', () => {
        const results: ExecutionStep[] = [];
        convertParametersProperty({
                script: "script",
                parameters: {
                    "param4": [1, 2, 3, 4],
                },
            },
            results,
            {getSteps, getRemainingActions},
            DEFAULT_EXTERNALS,
            DEFAULT_CONVERTORS,
        );
        execute(results);
        expect(mock).toBeCalledWith({
            param4: [1,2,3,4],
        });
    });

    it('convert hooks', () => {
        const context = createContext();
        const fun = jest.fn().mockReturnValue(69);
        const results: ExecutionStep[] = [];
        convertHooksProperty({
                hooks: ["fun"],
                script: "script",
                parameters: {
                    "test": "{fun()}",
                }
            },
            results,
            {getSteps, getRemainingActions},
            {...DEFAULT_EXTERNALS, fun},
            DEFAULT_CONVERTORS,
        );
        execute(results, {}, context);
        expect(mock).toBeCalledWith({
            test: 69,
        });
    });
});
