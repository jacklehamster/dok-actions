import assert from "assert";
import { ScriptAction } from "../actions/ScriptAction";
import { Context, createContext } from "../context/Context";
import { LogAction } from "../actions/LogAction";
import { ExecutionParameters, ExecutionStep, execute } from "../execution/ExecutionStep";
import { convertAction, convertScripts, executeScript } from "./convert-action";
import { Resolution } from "../resolutions/Resolution";
import { calculateResolution } from "../resolutions/calculate";
import { DokAction } from "../actions/Action";
import { getDefaultConvertors } from "./default-convertors";
import { DEFAULT_EXTERNALS } from "./default-externals";

describe('convertor', () => {
    const getSteps = jest.fn();
    const getRemainingActions = jest.fn();
    const context: Context = createContext();
    const refreshSteps = jest.fn();
    const stopRefresh = jest.fn();

    it('converts script action', async () => {
        const mockStep = jest.fn();
        const innerStep = (context: Context, params: ExecutionParameters) => mockStep(context, JSON.parse(JSON.stringify(params)));

        getSteps.mockReturnValue([
            innerStep,
        ]);
        const action: ScriptAction = {
            script: "myScript",
            parameters: {"x": "{1 + 2}"},
        };
        const steps: ExecutionStep[] = [];
        await convertAction(action, steps, {getSteps, getRemainingActions, refreshSteps, stopRefresh}, DEFAULT_EXTERNALS, getDefaultConvertors());

        expect(getSteps).toBeCalledWith({name: "myScript"});
        assert(steps.length);
        execute(steps, {x: 5}, context);
        expect(mockStep).toBeCalledWith(context, { x: 3 });
        execute(steps, {}, context);
        expect(mockStep).toBeCalledWith(context, { x: 3 });
    });

    it('converts script action without parameter override', async () => {
        const mockStep = jest.fn();
        const innerStep = (context: Context, params: ExecutionParameters) => mockStep(context, JSON.parse(JSON.stringify(params)));

        getSteps.mockReturnValue([
            innerStep,
        ]);
        const action: ScriptAction = {
            script: "myScript",
        };
        const steps: ExecutionStep[] = [];
        await convertAction(action, steps, {getSteps, getRemainingActions, refreshSteps, stopRefresh}, DEFAULT_EXTERNALS, getDefaultConvertors())

        expect(getSteps).toBeCalledWith({name: "myScript"});
        assert(steps.length);
        execute(steps, {x: 5}, context);
        expect(mockStep).toBeCalledWith(context, { x: 5 });
        execute(steps, {}, context);
        expect(mockStep).toBeCalledWith(context, { x: undefined });
    });

    it('convert log action', async () => {
        const log = jest.fn();
        const action: LogAction = {
            log: ["hello", "world"],
        };
        const steps: ExecutionStep[] = [];
        await convertAction(action, steps, {getSteps, getRemainingActions, refreshSteps, stopRefresh}, { log }, getDefaultConvertors());

        assert(steps.length);
        execute(steps, {}, context);
        expect(log).toBeCalledWith("hello", "world");
    });

    it('convert log action with resolution', async () => {
        const log = jest.fn();
        const action: LogAction = {
            log: ["hello", "{1 + 3}"],
        };
        const steps: ExecutionStep[] = [];
        await convertAction(action, steps, {getSteps, getRemainingActions, refreshSteps, stopRefresh}, { log }, getDefaultConvertors());
        assert(steps.length);
        execute(steps, {}, context);
        expect(log).toBeCalledWith("hello", 4);
    });

    it('convert script', async () => {
        const log = jest.fn();
        const scripts = [
            {
                name: "LogTest",
                actions: [
                    {
                        log: ["hello", "{name}"],    
                    }
                ],
            },
            {
                name: "ScriptTest",
                actions: [
                    {
                        script: "LogTest",
                        parameters: {"name": "test"}
                    },
                    {
                        script: "LogTest",
                        parameters: {"name": "world"}
                    },
                ]
            }
        ];
        const scriptMap = await convertScripts<DokAction>(scripts, {
            log,
        }, getDefaultConvertors(), {refreshSteps, stopRefresh});

        scriptMap.get(scripts.find(({name}) => name === "ScriptTest")!)!.forEach(step => step(context, {}));
        expect(log).toBeCalledWith("hello", "test");
        expect(log).toBeCalledWith("hello", "world");
    });

    it('execute script with loop', async () => {
        const log = jest.fn();
        await executeScript("main", undefined, [
            {
                name: "LogTest",
                actions: [
                    {
                        log: ["{index}", "hello", "{name}"],    
                    },
                ],
            },
            {
                name: "main",
                actions: [
                    {
                        script: "LogTest",
                        loop: "{3 + 2}",
                        parameters: {name : "test"}
                    },
                ],
            },
        ], {log}, getDefaultConvertors(), {refreshSteps, stopRefresh});
        expect(log).toBeCalledWith(0, "hello", "test");
        expect(log).toBeCalledWith(1, "hello", "test");
        expect(log).toBeCalledWith(2, "hello", "test");
        expect(log).toBeCalledWith(3, "hello", "test");
        expect(log).toBeCalledWith(4, "hello", "test");
    });


    it('execute script with condition', async () => {
        const log = jest.fn();
        await executeScript("main", undefined, [
            {
                name: "LogTest",
                actions: [
                    {
                        log: ["{index}", "hello", "{name}"],    
                    },
                ],
            },
            {
                name: "main",
                actions: [
                    {
                        loop: 1,
                        script: "LogTest",
                        parameters: {name : "test"},
                        condition: "{equalText(name, 'test')}",
                    },
                    {
                        loop: 1,
                        script: "LogTest",
                        parameters: {name : "test2"},
                        condition: "{equalText(name, 'test')}",
                    },
                    {
                        loop: 3,
                        script: "LogTest",
                        parameters: {name : "loopingtest"},
                        condition: "{index == 2}"
                    }
                ],
            },
        ], {log}, getDefaultConvertors(), {refreshSteps, stopRefresh});
        expect(log).toBeCalledWith(0, "hello", "test");
        expect(log).not.toBeCalledWith(0, "hello", "test2");
        expect(log).not.toBeCalledWith(0, "hello", "loopingtest");
        expect(log).not.toBeCalledWith(1, "hello", "loopingtest");
        expect(log).toBeCalledWith(2, "hello", "loopingtest");
    });

    it('execute script nesting', async () => {
        const log = jest.fn();
        await executeScript("main", undefined, [
            {
                name: "LogTest",
                actions: [
                    {
                        log: ["hello", "{name}", "{name2}"],    
                    },
                ],
            },
            {
                name: "sub",
                actions: [
                    {
                        script: "LogTest",
                        parameters: {name2 : "sub2"},
                    },
                ]
            },
            {
                name: "main",
                actions: [
                    {
                        script: "sub",
                        parameters: {name : "test", name2: "test2"},
                    },
                ],
            },
        ], {log}, getDefaultConvertors(), {refreshSteps, stopRefresh});
        expect(log).toBeCalledWith("hello", "test", "sub2");
    });
    
    it('convert action using a custom conversion map', async () => {
        const custom = jest.fn();
        await executeScript("main", undefined, [
            {
                name: "CustomTest",
                actions: [
                    {
                        custom: ["hello", "{name}", "{name2}"],    
                    },
                ],
            },
            {
                name: "sub",
                actions: [
                    {
                        script: "CustomTest",
                        parameters: {name2 : "sub2"},
                    },
                ]
            },
            {
                name: "main",
                actions: [
                    {
                        script: "sub",
                        parameters: {name : "test", name2: "test2"},
                    },
                ],
            },
        ], {}, [
            ...getDefaultConvertors(),
            async (action, results) => {
                if (!action.custom) {
                    return;
                }
                const messages: Resolution[] = Array.isArray(action.custom) ? action.custom : [action.custom];
                const resolutions = messages.map(m => calculateResolution(m));
                results.push((context) => custom(...resolutions.map(r => r?.valueOf(context))));
            },
        ], {refreshSteps, stopRefresh});
        expect(custom).toBeCalledWith("hello", "test", "sub2");        
    });
});
