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

    it('run scripts by name', () => {
        const processor = new ScriptProcessor([{
            name: "main",
            actions: [
                { mock: 123 },
            ],
        }], external, [
            (action, results) => results.push((_) => mock(action.mock)),
        ]);
        processor.runByName("main");
        expect(mock).toBeCalledWith(123);
    });

    it('run scripts by tags', () => {
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
            (action, results) => results.push((_) => mock(action.mock)),
        ]);
        processor.runByTags(["tagB"]);
        expect(mock).not.toBeCalledWith(123);
        expect(mock).toBeCalledWith(456);
        expect(mock).toBeCalledWith(789);
    });

    it('loop scripts by name', () => {
        const processor = new ScriptProcessor([{
            name: "main",
            actions: [
                { mock: "{time}" },
            ],
        }], external, [
            (action, results) => {
                const resolution = calculateNumber(action.mock);
                results.push((context) => mock(resolution.valueOf(context)));
            },
        ]);
        processor.loopByName("main");
        
        executeAnimationFrame(123);
        expect(mock).toBeCalledWith(123);
        executeAnimationFrame(456);
        expect(mock).toBeCalledWith(456);
    });

    it('loop scripts by tags', () => {
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
            (action, results) => {
                const resolution = calculateNumber(action.mock);
                results.push((context) => mock(resolution.valueOf(context)));
            },
        ]);
        processor.loopByTags([]);
        
        executeAnimationFrame(123);
        expect(mock).toBeCalledWith(1123);
        executeAnimationFrame(456);
        expect(mock).toBeCalledWith(1456);
    });

    it('should get steps', () => {
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
            (action, results) => {
                const resolution = calculateNumber(action.mock);
                results.push((context) => mock(resolution.valueOf(context)));
            },
        ]);
        execute(processor.getSteps({ name: "redraw" }));
        expect(mock).not.toBeCalled();
    });
});
