import { CallbackAction } from "../../actions/CallbackAction";
import { LogAction } from "../../actions/LogAction";
import { ExecutionStep, execute } from "../../execution/ExecutionStep";
import { getDefaultConvertors } from "../default-convertors";
import { convertCallbackProperty } from "./callback-convertor";

describe('callback convertor', () => {
    const log = jest.fn();
    const getSteps = jest.fn().mockReturnValue([]);
    const getRemainingActions = jest.fn().mockReturnValue([]);
    const refreshSteps = jest.fn();
    const stopRefresh = jest.fn();
    
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('convert callback', async () => {
        const results: ExecutionStep[] = [];
        const action: CallbackAction<LogAction> = {
            callback: { logCallback: [
                {
                    log: "log-test",
                }
            ]},
            executeCallback: "logCallback",
        };
        await convertCallbackProperty<LogAction>(action,
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            { log },
            getDefaultConvertors(),
        );
        execute(results);
        expect(log).toBeCalledWith("log-test");
    });

    it('convert callback not executed', async () => {
        const results: ExecutionStep[] = [];
        const action: CallbackAction<LogAction> = {
            callback: { logCallback: [
                {
                    log: "log-test",
                }
            ]},
        };
        await convertCallbackProperty<LogAction>(action,
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            { log },
            getDefaultConvertors(),
        );
        execute(results);
        expect(log).not.toBeCalled();
    });

    it('convert callback with extra params', async () => {
        const results: ExecutionStep[] = [];
        const action: CallbackAction<LogAction> = {
            callback: { logCallback: [
                {
                    log: "~{testValue}",
                }
            ]},
            executeCallback: "logCallback",
            parameters: { testValue: "log-test" }
        };
        await convertCallbackProperty<LogAction>(action,
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            { log },
            getDefaultConvertors(),
        );
        execute(results);
        expect(log).toBeCalledWith("log-test");
    });
});
