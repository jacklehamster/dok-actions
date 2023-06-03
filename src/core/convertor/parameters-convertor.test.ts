import { ExecutionStep, execute } from "../execution/ExecutionStep";
import { DEFAULT_EXTERNALS } from "./Convertor";
import { DEFAULT_CONVERTORS } from "./convert-action";
import { convertParametersProperty } from "./parameters-convertor";

describe('parameters convertor', () => {
    const mock = jest.fn();
    const scriptExecution: ExecutionStep = (context) => {
        mock(JSON.parse(JSON.stringify(context.parameters![context.parameters!.length - 1])));
    };
    const getSteps = jest.fn().mockReturnValue([scriptExecution]);
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
            getSteps,
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

    it('convert parameters2', () => {
        const results: ExecutionStep[] = [];
        convertParametersProperty({
                script: "script",
                parameters: {
                    "param4": [1, 2, 3, 4],
                },
            },
            results,
            getSteps,
            DEFAULT_EXTERNALS,
            DEFAULT_CONVERTORS,
        );
        execute(results);
        expect(mock).toBeCalledWith({
            param4: [1,2,3,4],
        });
    });
});
