import assert from "assert";
import { ScriptAction } from "../actions/ScriptAction";
import { Context } from "../context/Context";
import { LogAction } from "../actions/LogAction";
import { ExecutionParameters, ExecutionStep, execute } from "../execution/ExecutionStep";
import { DEFAULT_CONVERTORS, convertAction, convertScripts, executeScript } from "./convert-action";
import { Resolution } from "../resolutions/Resolution";
import { calculateResolution } from "../resolutions/calculate";

describe('convertor', () => {
    const getSteps = jest.fn();
    const context: Context = {
        parameters: [],
        cleanupActions: [],
    };

    it('converts script action', () => {
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
        convertAction(action, steps, getSteps)

        expect(getSteps).toBeCalledWith("myScript");
        assert(steps.length);
        execute(steps, {x: 5}, context);
        expect(mockStep).toBeCalledWith(context, { x: 3 });
        execute(steps, {}, context);
        expect(mockStep).toBeCalledWith(context, { x: 3 });
    });

    it('converts script action without parameter override', () => {
        const mockStep = jest.fn();
        const innerStep = (context: Context, params: ExecutionParameters) => mockStep(context, JSON.parse(JSON.stringify(params)));

        getSteps.mockReturnValue([
            innerStep,
        ]);
        const action: ScriptAction = {
            script: "myScript",
        };
        const steps: ExecutionStep[] = [];
        convertAction(action, steps, getSteps)

        expect(getSteps).toBeCalledWith("myScript");
        assert(steps.length);
        execute(steps, {x: 5}, context);
        expect(mockStep).toBeCalledWith(context, { x: 5 });
        execute(steps, {}, context);
        expect(mockStep).toBeCalledWith(context, { x: undefined });
    });

    it('convert log action', () => {
        const log = jest.fn();
        const action: LogAction = {
            log: ["hello", "world"],
        };
        const steps: ExecutionStep[] = [];
        convertAction(action, steps, getSteps, { log });

        assert(steps.length);
        execute(steps, {}, context);
        expect(log).toBeCalledWith("hello", "world");
    });

    it('convert log action with resolution', () => {
        const log = jest.fn();
        const action: LogAction = {
            log: ["hello", "{1 + 3}"],
        };
        const steps: ExecutionStep[] = [];
        convertAction(action, steps, getSteps, { log });
        assert(steps.length);
        execute(steps, {}, context);
        expect(log).toBeCalledWith("hello", 4);
    });

    it('convert script', () => {
        const log = jest.fn();
        const scriptMap = convertScripts([
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
        ],
        {
            log,
        });

        scriptMap["ScriptTest"].forEach(step => step(context, {}));
        expect(log).toBeCalledWith("hello", "test");
        expect(log).toBeCalledWith("hello", "world");
    });

    it('execute script with loop', () => {
        const log = jest.fn();
        executeScript("main", undefined, [
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
        ], {log});
        expect(log).toBeCalledWith(0, "hello", "test");
        expect(log).toBeCalledWith(1, "hello", "test");
        expect(log).toBeCalledWith(2, "hello", "test");
        expect(log).toBeCalledWith(3, "hello", "test");
        expect(log).toBeCalledWith(4, "hello", "test");
    });


    it('execute script with condition', () => {
        const log = jest.fn();
        executeScript("main", undefined, [
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
        ], {log});
        expect(log).toBeCalledWith(0, "hello", "test");
        expect(log).not.toBeCalledWith(0, "hello", "test2");
        expect(log).not.toBeCalledWith(0, "hello", "loopingtest");
        expect(log).not.toBeCalledWith(1, "hello", "loopingtest");
        expect(log).toBeCalledWith(2, "hello", "loopingtest");
    });

    it('execute script nesting', () => {
        const log = jest.fn();
        executeScript("main", undefined, [
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
        ], {log});
        expect(log).toBeCalledWith("hello", "test", "sub2");
    });
    
    it('convert action using a custom conversion map', () => {
        const custom = jest.fn();
        executeScript("main", undefined, [
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
        ], undefined, [
            ...DEFAULT_CONVERTORS,
            (action, results) => {
                if (!action.custom) {
                    return;
                }
                const messages: Resolution[] = Array.isArray(action.custom) ? action.custom : [action.custom];
                const resolutions = messages.map(m => calculateResolution(m));
                results.push((context) => custom(...resolutions.map(r => r.valueOf(context))));
            },
        ]);
        expect(custom).toBeCalledWith("hello", "test", "sub2");        
    });
});
