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
        }], external, [
            async (action, results) => results.push((_) => mock(action.mock)),
        ]);
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
        }], external, [
            async (action, results) => results.push((_) => mock(action.mock)),
        ]);
        await processor.runByTags(["tagB"]);
        expect(mock).not.toBeCalledWith(123);
        expect(mock).toBeCalledWith(456);
        expect(mock).toBeCalledWith(789);
    });

    it('loop scripts by name', async () => {
        const processor = new ScriptProcessor([{
            name: "main",
            actions: [
                { mock: "{time}" },
            ],
        }], external, [
            async (action, results) => {
                const resolution = calculateNumber(action.mock);
                results.push((context) => mock(resolution.valueOf(context)));
            },
        ]);
        await processor.refreshByName("main");
        
        executeAnimationFrame(123);
        expect(mock).toBeCalledWith(123);
        executeAnimationFrame(456);
        expect(mock).toBeCalledWith(456);
    });

    it('loop scripts by tags', async () => {
        const processor = new ScriptProcessor([{
            name: "main",
            actions: [
                { mock: "{time}" },
            ],
            tags: ["tag2"],
        }, {
            name: "main2",
            actions: [
                { mock: "{1000 + time}" },
            ],
            tags: ["tag2"],
        }], external, [
            async (action, results) => {
                const resolution = calculateNumber(action.mock);
                results.push((context) => mock(resolution.valueOf(context)));
            },
        ]);
        await processor.refreshByTags([]);
        
        executeAnimationFrame(123);
        expect(mock).toBeCalledWith(1123);
        executeAnimationFrame(456);
        expect(mock).toBeCalledWith(1456);
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
        }], external, [
            async (action, results) => {
                const resolution = calculateNumber(action.mock);
                results.push((context) => mock(resolution.valueOf(context)));
            },
        ]);
        execute(await processor.getSteps({ name: "redraw" }));
        expect(mock).not.toBeCalled();
    });
});
