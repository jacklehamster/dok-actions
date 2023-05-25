import assert from "assert";
import { ScriptAction } from "../actions/ScriptAction";
import { Context } from "../context/Context";
import { convertAction, convertScripts, executeScript } from "./Convertor";
import { LogAction } from "../actions/LogAction";

describe('convertor', () => {
    const getSteps = jest.fn();
    const context: Context = {
        parameters: [],
        cleanupActions: [],
    };

    it('converts script action', () => {
        const mockStep = jest.fn();
        const innerStep = (context: Context, params: Record<string, any>) => mockStep(context, JSON.parse(JSON.stringify(params)));

        getSteps.mockReturnValue([
            innerStep,
        ]);
        const action: ScriptAction = {
            script: "myScript",
            parameters: {"x": "{1 + 2}"},
        };
        const step = convertAction(action, getSteps);
        expect(getSteps).toBeCalledWith("myScript");
        assert(step);
        step(context, {x: 5});
        expect(mockStep).toBeCalledWith(context, { x: 3, index: 0 });
        step(context, {});
        expect(mockStep).toBeCalledWith(context, { x: 3, index: 0 });
    });

    it('converts script action2', () => {
        const mockStep = jest.fn();
        const innerStep = (context: Context, params: Record<string, any>) => mockStep(context, JSON.parse(JSON.stringify(params)));

        getSteps.mockReturnValue([
            innerStep,
        ]);
        const action: ScriptAction = {
            script: "myScript",
        };
        const step = convertAction(action, getSteps);
        expect(getSteps).toBeCalledWith("myScript");
        assert(step);
        step(context, {x: 5});
        expect(mockStep).toBeCalledWith(context, { x: 5, index: 0 });
        step(context, {});
        expect(mockStep).toBeCalledWith(context, { x: undefined, index: 0 });
    });

    it('convert log action', () => {
        const log = jest.fn();
        const action: LogAction = {
            action: "log",
            messages: ["hello", "world"],
        };
        const step = convertAction(action, getSteps, {
            log,
        });
        assert(step);
        step(context, {});
        expect(log).toBeCalledWith("hello", "world");
    });

    it('convert log action with resolution', () => {
        const log = jest.fn();
        const action: LogAction = {
            action: "log",
            messages: ["hello", "{1 + 3}"],
        };
        const step = convertAction(action, getSteps, {
            log,
        });
        assert(step);
        step(context, {});
        expect(log).toBeCalledWith("hello", 4);
    });

    it('convert script', () => {
        const log = jest.fn();
        const scriptMap = convertScripts([
            {
                name: "LogTest",
                actions: [
                    {
                        action: "log",
                        messages: ["hello", "{name}"],    
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
        ], undefined,
        {
            log,
        });

        scriptMap["ScriptTest"].forEach(step => step(context, {}));
        expect(log).toBeCalledWith("hello", "test");
        expect(log).toBeCalledWith("hello", "world");
    });

    it('execute script with loop', () => {
        const log = jest.fn();
        executeScript("main", [
            {
                name: "LogTest",
                actions: [
                    {
                        action: "log",
                        messages: ["{index}", "hello", "{name}"],    
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
        ], context, undefined, {log});
        expect(log).toBeCalledWith(0, "hello", "test");
        expect(log).toBeCalledWith(1, "hello", "test");
        expect(log).toBeCalledWith(2, "hello", "test");
        expect(log).toBeCalledWith(3, "hello", "test");
        expect(log).toBeCalledWith(4, "hello", "test");
    });


    it('execute script with condition', () => {
        const log = jest.fn();
        executeScript("main", [
            {
                name: "LogTest",
                actions: [
                    {
                        action: "log",
                        messages: ["{index}", "hello", "{name}"],    
                    },
                ],
            },
            {
                name: "main",
                actions: [
                    {
                        script: "LogTest",
                        parameters: {name : "test"},
                        condition: "{equalText(name, 'test')}",
                    },
                    {
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
        ], context, undefined, {log});
        expect(log).toBeCalledWith(0, "hello", "test");
        expect(log).not.toBeCalledWith(0, "hello", "test2");
        expect(log).not.toBeCalledWith(0, "hello", "loopingtest");
        expect(log).not.toBeCalledWith(1, "hello", "loopingtest");
        expect(log).toBeCalledWith(2, "hello", "loopingtest");
    });

    it('execute script nesting', () => {
        const log = jest.fn();
        executeScript("main", [
            {
                name: "LogTest",
                actions: [
                    {
                        action: "log",
                        messages: ["hello", "{name}", "{name2}"],    
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
        ], context, undefined, {log});
        expect(log).toBeCalledWith("hello", "test", "sub2");
    });    
});
