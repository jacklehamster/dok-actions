import { ActionsAction } from "../../actions/ActionsAction";
import { CallbackAction } from "../../actions/CallbackAction";
import { LogAction } from "../../actions/LogAction";
import { execute } from "../../execution/ExecutionStep";
import { StepScript } from "../Convertor";
import { getDefaultConvertors } from "../default-convertors";
import { convertActionsProperty } from "./actions-convertor";
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
        const results: StepScript = new StepScript();
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
        const results: StepScript = new StepScript()
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
        const results: StepScript = new StepScript()
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

    it.skip('convert multiple actions', async () => {
        const results: StepScript = new StepScript();
        const action: ActionsAction<CallbackAction<LogAction>> = {
            actions: [
                {
                    sets: { a: 100 },
                    callback: { logCallback: [
                        {
                            log: "~log-test {param} {a}",
                        }
                    ]},
                    executeCallback: "logCallback",
                    parameters: {
                        param: 123,
                    },
                },
                {
                    sets: { a: 200 },
                    callback: { logCallback: [
                        {
                            log: "~log-test-2 {param} {a}",
                        }
                    ]},
                    executeCallback: "logCallback",    
                    parameters: {
                        param: 456,
                    },
                },
            ],
        };
        await convertActionsProperty<CallbackAction<LogAction>>(action,
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            { log },
            getDefaultConvertors(),
        );
        execute(results);
        expect(log).toBeCalledWith("log-test 123 100");
        expect(log).toBeCalledWith("log-test-2 456 200");
    });


    it.skip('convert multiple callback', async () => {
        const results: StepScript = new StepScript();
        const action: ActionsAction<CallbackAction<LogAction>> = {
            actions: [
                {
                    sets: { a: 100 },
                    callback: { logCallback: [
                        {
                            log: "~log-test {param} {a}",
                        }
                    ]},
                    actions: [
                        {
                            delay: 100,
                            executeCallback: "logCallback",
                            parameters: {
                                param: 123,
                            },
                        }
                    ],
                },
                {
                    sets: { a: 200 },
                    callback: { logCallback: [
                        {
                            log: "~log-test-2 {param} {a}",
                        }
                    ]},
                    actions: [
                        {
                            delay: 100,
                            executeCallback: "logCallback",
                            parameters: {
                                param: 456,
                            },
                        }
                    ]
                },
            ],
        };
        await convertActionsProperty<CallbackAction<LogAction>>(action,
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            { log, setTimeout },
            getDefaultConvertors(),
        );
        execute(results);
        await new Promise(r => setTimeout(r, 500));
        expect(log).toBeCalledWith("log-test 123 100");
        expect(log).toBeCalledWith("log-test-2 456 200");
    });
});
