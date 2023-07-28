import { execute } from "../execution/ExecutionStep";
import { calculateNumber } from "../resolutions/calculateNumber";
import { ScriptProcessor } from "./ScriptProcessor";

describe('ScriptProcesor', () => {
    const mock = jest.fn();
    const cbs: FrameRequestCallback[] = [];
    const external = {
        mock,
    };

    beforeAll(() => {
        global.requestAnimationFrame = (cb) => { cbs.push(cb); return 0; };
    });

    beforeEach(() => {
    });

    afterEach(() => {
        mock.mockClear();
        jest.clearAllMocks();
        jest.restoreAllMocks();
        cbs.length = 0;
    })

    function executeAnimationFrame(time: number) {
        cbs.shift()?.(time);
    }

    it('run scripts by name', async () => {
        const processor = new ScriptProcessor([{
            name: "main",
            actions: [
                { mock: 123 },
            ],
        }], external, { actionsConvertor: [
            async (action, results) => results.push((_) => mock(action.mock)),
        ]});
        await processor.runByName("main");
        expect(mock).toBeCalledWith(123);
    });

    it('run scripts by tags', async () => {
        const processor = new ScriptProcessor([{
            name: "main",
            actions: [
                { mock: 123 },
            ],
            tags: ["tagA"]
        }, {
            name: "main2",
            actions: [
                { mock: 456 },
            ],
            tags: ["tagB"],
        }, {
            name: "main3",
            actions: [
                { mock: 789 },
            ],
            tags: ["tagB", "tagA"],
        }], external, { actionsConvertor: [
            async (action, results) => results.push((_) => mock(action.mock)),
        ]});
        await processor.runByTags(["tagB"]);
        expect(mock).not.toBeCalledWith(123);
        expect(mock).toBeCalledWith(456);
        expect(mock).toBeCalledWith(789);
    });

    it('refresh scripts by name', async () => {
        const processor = new ScriptProcessor([{
            name: "main",
            actions: [
                { mock: "~{time}" },
            ],
        }], external, { actionsConvertor: [
            async (action, results) => {
                const resolution = calculateNumber(action.mock);
                results.push((parameters) => mock(resolution.valueOf(parameters)));
            },
        ]});
        await processor.refreshByName("main", {
            frameRate: 60,
        });
        
        executeAnimationFrame(123);
        expect(mock).toBeCalledWith(123);
        executeAnimationFrame(456);
        expect(mock).toBeCalledWith(456);
    });

    it('refresh scripts by tags', async () => {
        const processor = new ScriptProcessor([{
            name: "main",
            actions: [
                { mock: "~{time}" },
            ],
            tags: ["tag2"],
        }, {
            name: "main2",
            actions: [
                { mock: "~{1000 + time}" },
            ],
            tags: ["tag2"],
        }], external, { actionsConvertor: [
            async (action, results) => {
                const resolution = calculateNumber(action.mock);
                results.push((parameters) => mock(resolution.valueOf(parameters)));
            },
        ]});
        await processor.refreshByTags([], {
            frameRate: 60,
        });
        
        executeAnimationFrame(123);
        expect(mock).toBeCalledWith(1123);
        executeAnimationFrame(456);
        expect(mock).toBeCalledWith(1456);
    });

    it('refresh scripts with frameRate', async () => {
        const processor = new ScriptProcessor([{
            name: "main",
            actions: [
                { mock: "~{time}" },
            ],
            tags: ["tag2"],
        }, {
            name: "main2",
            actions: [
                { mock: "~{1000 + time}" },
            ],
            tags: ["tag2"],
        }], external, { actionsConvertor: [
            async (action, results) => {
                const resolution = calculateNumber(action.mock);
                results.push((parameters) => mock(resolution.valueOf(parameters)));
            },
        ]});
        await processor.refreshByTags([], {
            frameRate: 1,
        });
        
        executeAnimationFrame(123);
        expect(mock).toBeCalledWith(1123);
        executeAnimationFrame(456);
        expect(mock).not.toBeCalledWith(1456);
        executeAnimationFrame(3000);
        expect(mock).toBeCalledWith(4000);
    });

    it('should get steps', async () => {
        const processor = new ScriptProcessor([{
            name: "main",
            actions: [
                { mock: 1},
            ],
            tags: ["tag2"],
        }, {
            name: "main2",
            actions: [
                { mock: 2},
            ],
            tags: ["tag2"],
        }, {
            actions: [
                { mock: 3},
            ],
        }], external, { actionsConvertor: [
            async (action, results) => {
                const resolution = calculateNumber(action.mock);
                results.push((parameters) => mock(resolution.valueOf(parameters)));
            },
        ]});
        execute(await processor.getSteps({ name: "redraw" }));
        expect(mock).not.toBeCalled();
    });
});

describe("script execution", () => {
   const log = jest.fn();
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("execute nested loop", async () => {
        const processor = new ScriptProcessor([
            {
                name: "test",
                actions: [
                    {
                        loop: 3,
                        set: {variable:"a", value:"~{loopIndex}"},
                        actions: [
                            {
                                loop: 4,
                                set: {variable:"b", value:"~{loopIndex}"},
                                log: "~{a * 10 + b}",
                            },
                        ],
                    },
                ],
            },
        ], {log});
        await processor.runByName("test");
        expect(log).toBeCalledWith(0);
        expect(log).toBeCalledWith(1);
        expect(log).toBeCalledWith(2);
        expect(log).toBeCalledWith(3);
        expect(log).toBeCalledWith(10);
        expect(log).toBeCalledWith(11);
        expect(log).toBeCalledWith(12);
        expect(log).toBeCalledWith(13);
        expect(log).toBeCalledWith(20);
        expect(log).toBeCalledWith(21);
        expect(log).toBeCalledWith(22);
        expect(log).toBeCalledWith(23);
        expect(log).not.toBeCalledWith(4);
    });
});
