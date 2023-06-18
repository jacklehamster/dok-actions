import { LogAction } from "../actions/LogAction";
import { LogicAction } from "../actions/LogicAction";
import { PauseAction } from "../actions/PauseAction";
import { ScriptAction } from "../actions/ScriptAction";
import { createContext } from "../context/Context";
import { ExecutionStep, execute } from "../execution/ExecutionStep";
import { Script } from "../scripts/Script";
import { ConvertBehavior } from "./Convertor";
import { convertAction, convertScripts, executeAction, executeScript } from "./convert-action";
import { getDefaultConvertors } from "./default-convertors";

describe('action convertor', () => {
    const log = jest.fn();
    const getSteps = jest.fn().mockReturnValue([]);
    const getRemainingActions = jest.fn().mockReturnValue([]);
    const refreshSteps = jest.fn();
    const stopRefresh = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('convert action no skip', async () => {
        const results: ExecutionStep[] = [];
        const behavior = await convertAction<LogAction>({
                log: "log-test",
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            { log },
            getDefaultConvertors(),
        );
        expect(behavior).toBeUndefined();
        execute(results);
        expect(log).toBeCalledWith("log-test");
    });

    it('convert action with skip convertor', async () => {
        const results: ExecutionStep[] = [];
        const behavior = await convertAction<LogAction & LogicAction>({
                log: "log-test",
                condition: false,
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            { log },
            getDefaultConvertors(),
        );
        expect(behavior).toBeUndefined();
        execute(results);
        expect(log).not.toBeCalled();

    });

    it('convert action with skip actions', async () => {
        const results: ExecutionStep[] = [];
        const behavior = await convertAction<LogAction & PauseAction>({
                log: "log-test",
                pause: true,
            },
            results,
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            { log },
            getDefaultConvertors(),
        );
        expect(behavior).toEqual(ConvertBehavior.SKIP_REMAINING_ACTIONS);
        execute(results);
        expect(log).not.toBeCalled();

    });
});

describe('convert script', () => {
    const log = jest.fn();
    const refreshSteps = jest.fn();
    const stopRefresh = jest.fn();
    it('convert scripts without skip', async () => {
        const scripts = [
            {
                name: "script-1",
                actions: [
                ]
            },
            {
                name: "script-2",
                actions: [
                    { log: "test" },
                ]
            },
        ];
        const map = await convertScripts<LogAction>(scripts, {log},
        getDefaultConvertors(),
        { refreshSteps, stopRefresh });

        expect(map.get(scripts[0])?.length).toEqual(0);
        expect(map.get(scripts[1])?.length).toEqual(1);
    });

    it('execute scripts', async () => {
        const scripts: Script<ScriptAction & LogAction>[] = [
            {
                name: "main-script",
                actions: [
                    {
                        script: "sub-script",
                    },
                ],
            },
            {
                name: "sub-script",
                actions: [
                    { log: "test" },
                ]
            },
        ];
        executeScript("main-script", undefined, scripts, { log }, getDefaultConvertors(),
            { refreshSteps, stopRefresh });
    });
});

describe('action executor', () => {
    const log = jest.fn();
    const getSteps = jest.fn().mockReturnValue([]);
    const getRemainingActions = jest.fn().mockReturnValue([]);
    const refreshSteps = jest.fn();
    const stopRefresh = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('execute action', async () => {
        await executeAction<LogAction>({
                log: "log-test",
            },
            {},
            createContext({
                external: { log },
            }),
            {getSteps, getRemainingActions, refreshSteps, stopRefresh},
            getDefaultConvertors(),
        );
        expect(log).toBeCalledWith("log-test");
    });
});
