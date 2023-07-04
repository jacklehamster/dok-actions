import { ScriptAction } from "../../actions/ScriptAction";
import { createContext } from "../../context/Context";
import { ExecutionStep, execute } from "../../execution/ExecutionStep";
import { getDefaultConvertors } from "../default-convertors";
import { DEFAULT_EXTERNALS } from "../default-externals";
import { convertHooksProperty } from "./hooks-convertor";
import { convertParametersProperty } from "./parameters-convertor";
import { convertScriptProperty } from "./script-convertor";

describe('hooks convertor', () => {
    const mock = jest.fn();
    const scriptExecution: ExecutionStep = (parameters) => {
        mock(JSON.parse(JSON.stringify(parameters)));
    };
    const getSteps = jest.fn().mockReturnValue([scriptExecution]);
    const getRemainingActions = jest.fn().mockReturnValue([]);
    const refreshSteps = jest.fn();
    const stopRefresh = jest.fn();

    it('convert hooks', async () => {
        const context = createContext();
        const fun = jest.fn().mockReturnValue(69);
        const results: ExecutionStep[] = [];
        const actions = {
            hooks: ["fun"],
            executeScript: "script",
            parameters: {
                "test": "~{fun()}",
            }
        };

        await convertHooksProperty<ScriptAction>(actions,
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            {...DEFAULT_EXTERNALS, fun}
        );
        await convertParametersProperty<ScriptAction>(actions,
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            {...DEFAULT_EXTERNALS, fun},
            getDefaultConvertors(),
        );
        await convertScriptProperty<ScriptAction>(actions,
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
        );
        execute(results, {}, context);
        expect(mock).toBeCalledWith({
            test: 69,
        });
    });
});
